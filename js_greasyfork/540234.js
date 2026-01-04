// ==UserScript==
// @name        WeatherWidget
// @namespace   Violentmonkey Scripts
// @description A userscript that shows location and temperature on your webpages.
// @match       *://*/*
// @version     0.0.0
// @author      Elliot
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/ui@0.7
// @connect     geoplugin.net
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/540234/WeatherWidget.user.js
// @updateURL https://update.greasyfork.org/scripts/540234/WeatherWidget.meta.js
// ==/UserScript==

(function (ui) {
'use strict';

const IS_DEV = false;
const equalFn = (a, b) => a === b;
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
  c.user = true;
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
function insert(parent, accessor, marker, initial) {
  if (marker !== undefined && !initial) initial = [];
  if (typeof accessor !== "function") return insertExpression(parent, accessor, initial, marker);
  createRenderEffect(current => insertExpression(parent, accessor(), current, marker), initial);
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

function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function (n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
}

var css_248z = "";

var stylesheet="*,:after,:before{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 transparent;--un-ring-shadow:0 0 transparent;--un-shadow-inset: ;--un-shadow:0 0 transparent;--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgba(147,197,253,.5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }::backdrop{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 transparent;--un-ring-shadow:0 0 transparent;--un-shadow-inset: ;--un-shadow:0 0 transparent;--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgba(147,197,253,.5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }.style-module_count__cBFXn{--un-text-opacity:1;color:rgb(249 115 22/var(--un-text-opacity))}.style-module_plus1__fsYU8{float:right}";

function getAugmentedNamespace(n) {
  if (Object.prototype.hasOwnProperty.call(n, '__esModule')) return n;
  var f = n.default;
	if (typeof f == "function") {
		var a = function a () {
			var isInstance = false;
      try {
        isInstance = this instanceof a;
      } catch {}
			if (isInstance) {
        return Reflect.construct(f, arguments, this.constructor);
			}
			return f.apply(this, arguments);
		};
		a.prototype = f.prototype;
  } else a = {};
  Object.defineProperty(a, '__esModule', {value: true});
	Object.keys(n).forEach(function (k) {
		var d = Object.getOwnPropertyDescriptor(n, k);
		Object.defineProperty(a, k, d.get ? d : {
			enumerable: true,
			get: function () {
				return n[k];
			}
		});
	});
	return a;
}

var lib = {};

const SIZEOF_SHORT = 2;
const SIZEOF_INT = 4;
const FILE_IDENTIFIER_LENGTH = 4;
const SIZE_PREFIX_LENGTH = 4;

const int32 = new Int32Array(2);
const float32 = new Float32Array(int32.buffer);
const float64 = new Float64Array(int32.buffer);
const isLittleEndian = new Uint16Array(new Uint8Array([1, 0]).buffer)[0] === 1;

var Encoding;
(function (Encoding) {
    Encoding[Encoding["UTF8_BYTES"] = 1] = "UTF8_BYTES";
    Encoding[Encoding["UTF16_STRING"] = 2] = "UTF16_STRING";
})(Encoding || (Encoding = {}));

class ByteBuffer {
    /**
     * Create a new ByteBuffer with a given array of bytes (`Uint8Array`)
     */
    constructor(bytes_) {
        this.bytes_ = bytes_;
        this.position_ = 0;
        this.text_decoder_ = new TextDecoder();
    }
    /**
     * Create and allocate a new ByteBuffer with a given size.
     */
    static allocate(byte_size) {
        return new ByteBuffer(new Uint8Array(byte_size));
    }
    clear() {
        this.position_ = 0;
    }
    /**
     * Get the underlying `Uint8Array`.
     */
    bytes() {
        return this.bytes_;
    }
    /**
     * Get the buffer's position.
     */
    position() {
        return this.position_;
    }
    /**
     * Set the buffer's position.
     */
    setPosition(position) {
        this.position_ = position;
    }
    /**
     * Get the buffer's capacity.
     */
    capacity() {
        return this.bytes_.length;
    }
    readInt8(offset) {
        return this.readUint8(offset) << 24 >> 24;
    }
    readUint8(offset) {
        return this.bytes_[offset];
    }
    readInt16(offset) {
        return this.readUint16(offset) << 16 >> 16;
    }
    readUint16(offset) {
        return this.bytes_[offset] | this.bytes_[offset + 1] << 8;
    }
    readInt32(offset) {
        return this.bytes_[offset] | this.bytes_[offset + 1] << 8 | this.bytes_[offset + 2] << 16 | this.bytes_[offset + 3] << 24;
    }
    readUint32(offset) {
        return this.readInt32(offset) >>> 0;
    }
    readInt64(offset) {
        return BigInt.asIntN(64, BigInt(this.readUint32(offset)) + (BigInt(this.readUint32(offset + 4)) << BigInt(32)));
    }
    readUint64(offset) {
        return BigInt.asUintN(64, BigInt(this.readUint32(offset)) + (BigInt(this.readUint32(offset + 4)) << BigInt(32)));
    }
    readFloat32(offset) {
        int32[0] = this.readInt32(offset);
        return float32[0];
    }
    readFloat64(offset) {
        int32[isLittleEndian ? 0 : 1] = this.readInt32(offset);
        int32[isLittleEndian ? 1 : 0] = this.readInt32(offset + 4);
        return float64[0];
    }
    writeInt8(offset, value) {
        this.bytes_[offset] = value;
    }
    writeUint8(offset, value) {
        this.bytes_[offset] = value;
    }
    writeInt16(offset, value) {
        this.bytes_[offset] = value;
        this.bytes_[offset + 1] = value >> 8;
    }
    writeUint16(offset, value) {
        this.bytes_[offset] = value;
        this.bytes_[offset + 1] = value >> 8;
    }
    writeInt32(offset, value) {
        this.bytes_[offset] = value;
        this.bytes_[offset + 1] = value >> 8;
        this.bytes_[offset + 2] = value >> 16;
        this.bytes_[offset + 3] = value >> 24;
    }
    writeUint32(offset, value) {
        this.bytes_[offset] = value;
        this.bytes_[offset + 1] = value >> 8;
        this.bytes_[offset + 2] = value >> 16;
        this.bytes_[offset + 3] = value >> 24;
    }
    writeInt64(offset, value) {
        this.writeInt32(offset, Number(BigInt.asIntN(32, value)));
        this.writeInt32(offset + 4, Number(BigInt.asIntN(32, value >> BigInt(32))));
    }
    writeUint64(offset, value) {
        this.writeUint32(offset, Number(BigInt.asUintN(32, value)));
        this.writeUint32(offset + 4, Number(BigInt.asUintN(32, value >> BigInt(32))));
    }
    writeFloat32(offset, value) {
        float32[0] = value;
        this.writeInt32(offset, int32[0]);
    }
    writeFloat64(offset, value) {
        float64[0] = value;
        this.writeInt32(offset, int32[isLittleEndian ? 0 : 1]);
        this.writeInt32(offset + 4, int32[isLittleEndian ? 1 : 0]);
    }
    /**
     * Return the file identifier.   Behavior is undefined for FlatBuffers whose
     * schema does not include a file_identifier (likely points at padding or the
     * start of a the root vtable).
     */
    getBufferIdentifier() {
        if (this.bytes_.length < this.position_ + SIZEOF_INT +
            FILE_IDENTIFIER_LENGTH) {
            throw new Error('FlatBuffers: ByteBuffer is too short to contain an identifier.');
        }
        let result = "";
        for (let i = 0; i < FILE_IDENTIFIER_LENGTH; i++) {
            result += String.fromCharCode(this.readInt8(this.position_ + SIZEOF_INT + i));
        }
        return result;
    }
    /**
     * Look up a field in the vtable, return an offset into the object, or 0 if the
     * field is not present.
     */
    __offset(bb_pos, vtable_offset) {
        const vtable = bb_pos - this.readInt32(bb_pos);
        return vtable_offset < this.readInt16(vtable) ? this.readInt16(vtable + vtable_offset) : 0;
    }
    /**
     * Initialize any Table-derived type to point to the union at the given offset.
     */
    __union(t, offset) {
        t.bb_pos = offset + this.readInt32(offset);
        t.bb = this;
        return t;
    }
    /**
     * Create a JavaScript string from UTF-8 data stored inside the FlatBuffer.
     * This allocates a new string and converts to wide chars upon each access.
     *
     * To avoid the conversion to string, pass Encoding.UTF8_BYTES as the
     * "optionalEncoding" argument. This is useful for avoiding conversion when
     * the data will just be packaged back up in another FlatBuffer later on.
     *
     * @param offset
     * @param opt_encoding Defaults to UTF16_STRING
     */
    __string(offset, opt_encoding) {
        offset += this.readInt32(offset);
        const length = this.readInt32(offset);
        offset += SIZEOF_INT;
        const utf8bytes = this.bytes_.subarray(offset, offset + length);
        if (opt_encoding === Encoding.UTF8_BYTES)
            return utf8bytes;
        else
            return this.text_decoder_.decode(utf8bytes);
    }
    /**
     * Handle unions that can contain string as its member, if a Table-derived type then initialize it,
     * if a string then return a new one
     *
     * WARNING: strings are immutable in JS so we can't change the string that the user gave us, this
     * makes the behaviour of __union_with_string different compared to __union
     */
    __union_with_string(o, offset) {
        if (typeof o === 'string') {
            return this.__string(offset);
        }
        return this.__union(o, offset);
    }
    /**
     * Retrieve the relative offset stored at "offset"
     */
    __indirect(offset) {
        return offset + this.readInt32(offset);
    }
    /**
     * Get the start of data of a vector whose offset is stored at "offset" in this object.
     */
    __vector(offset) {
        return offset + this.readInt32(offset) + SIZEOF_INT; // data starts after the length
    }
    /**
     * Get the length of a vector whose offset is stored at "offset" in this object.
     */
    __vector_len(offset) {
        return this.readInt32(offset + this.readInt32(offset));
    }
    __has_identifier(ident) {
        if (ident.length != FILE_IDENTIFIER_LENGTH) {
            throw new Error('FlatBuffers: file identifier must be length ' +
                FILE_IDENTIFIER_LENGTH);
        }
        for (let i = 0; i < FILE_IDENTIFIER_LENGTH; i++) {
            if (ident.charCodeAt(i) != this.readInt8(this.position() + SIZEOF_INT + i)) {
                return false;
            }
        }
        return true;
    }
    /**
     * A helper function for generating list for obj api
     */
    createScalarList(listAccessor, listLength) {
        const ret = [];
        for (let i = 0; i < listLength; ++i) {
            const val = listAccessor(i);
            if (val !== null) {
                ret.push(val);
            }
        }
        return ret;
    }
    /**
     * A helper function for generating list for obj api
     * @param listAccessor function that accepts an index and return data at that index
     * @param listLength listLength
     * @param res result list
     */
    createObjList(listAccessor, listLength) {
        const ret = [];
        for (let i = 0; i < listLength; ++i) {
            const val = listAccessor(i);
            if (val !== null) {
                ret.push(val.unpack());
            }
        }
        return ret;
    }
}

class Builder {
    /**
     * Create a FlatBufferBuilder.
     */
    constructor(opt_initial_size) {
        /** Minimum alignment encountered so far. */
        this.minalign = 1;
        /** The vtable for the current table. */
        this.vtable = null;
        /** The amount of fields we're actually using. */
        this.vtable_in_use = 0;
        /** Whether we are currently serializing a table. */
        this.isNested = false;
        /** Starting offset of the current struct/table. */
        this.object_start = 0;
        /** List of offsets of all vtables. */
        this.vtables = [];
        /** For the current vector being built. */
        this.vector_num_elems = 0;
        /** False omits default values from the serialized data */
        this.force_defaults = false;
        this.string_maps = null;
        this.text_encoder = new TextEncoder();
        let initial_size;
        if (!opt_initial_size) {
            initial_size = 1024;
        }
        else {
            initial_size = opt_initial_size;
        }
        /**
         * @type {ByteBuffer}
         * @private
         */
        this.bb = ByteBuffer.allocate(initial_size);
        this.space = initial_size;
    }
    clear() {
        this.bb.clear();
        this.space = this.bb.capacity();
        this.minalign = 1;
        this.vtable = null;
        this.vtable_in_use = 0;
        this.isNested = false;
        this.object_start = 0;
        this.vtables = [];
        this.vector_num_elems = 0;
        this.force_defaults = false;
        this.string_maps = null;
    }
    /**
     * In order to save space, fields that are set to their default value
     * don't get serialized into the buffer. Forcing defaults provides a
     * way to manually disable this optimization.
     *
     * @param forceDefaults true always serializes default values
     */
    forceDefaults(forceDefaults) {
        this.force_defaults = forceDefaults;
    }
    /**
     * Get the ByteBuffer representing the FlatBuffer. Only call this after you've
     * called finish(). The actual data starts at the ByteBuffer's current position,
     * not necessarily at 0.
     */
    dataBuffer() {
        return this.bb;
    }
    /**
     * Get the bytes representing the FlatBuffer. Only call this after you've
     * called finish().
     */
    asUint8Array() {
        return this.bb.bytes().subarray(this.bb.position(), this.bb.position() + this.offset());
    }
    /**
     * Prepare to write an element of `size` after `additional_bytes` have been
     * written, e.g. if you write a string, you need to align such the int length
     * field is aligned to 4 bytes, and the string data follows it directly. If all
     * you need to do is alignment, `additional_bytes` will be 0.
     *
     * @param size This is the of the new element to write
     * @param additional_bytes The padding size
     */
    prep(size, additional_bytes) {
        // Track the biggest thing we've ever aligned to.
        if (size > this.minalign) {
            this.minalign = size;
        }
        // Find the amount of alignment needed such that `size` is properly
        // aligned after `additional_bytes`
        const align_size = ((~(this.bb.capacity() - this.space + additional_bytes)) + 1) & (size - 1);
        // Reallocate the buffer if needed.
        while (this.space < align_size + size + additional_bytes) {
            const old_buf_size = this.bb.capacity();
            this.bb = Builder.growByteBuffer(this.bb);
            this.space += this.bb.capacity() - old_buf_size;
        }
        this.pad(align_size);
    }
    pad(byte_size) {
        for (let i = 0; i < byte_size; i++) {
            this.bb.writeInt8(--this.space, 0);
        }
    }
    writeInt8(value) {
        this.bb.writeInt8(this.space -= 1, value);
    }
    writeInt16(value) {
        this.bb.writeInt16(this.space -= 2, value);
    }
    writeInt32(value) {
        this.bb.writeInt32(this.space -= 4, value);
    }
    writeInt64(value) {
        this.bb.writeInt64(this.space -= 8, value);
    }
    writeFloat32(value) {
        this.bb.writeFloat32(this.space -= 4, value);
    }
    writeFloat64(value) {
        this.bb.writeFloat64(this.space -= 8, value);
    }
    /**
     * Add an `int8` to the buffer, properly aligned, and grows the buffer (if necessary).
     * @param value The `int8` to add the buffer.
     */
    addInt8(value) {
        this.prep(1, 0);
        this.writeInt8(value);
    }
    /**
     * Add an `int16` to the buffer, properly aligned, and grows the buffer (if necessary).
     * @param value The `int16` to add the buffer.
     */
    addInt16(value) {
        this.prep(2, 0);
        this.writeInt16(value);
    }
    /**
     * Add an `int32` to the buffer, properly aligned, and grows the buffer (if necessary).
     * @param value The `int32` to add the buffer.
     */
    addInt32(value) {
        this.prep(4, 0);
        this.writeInt32(value);
    }
    /**
     * Add an `int64` to the buffer, properly aligned, and grows the buffer (if necessary).
     * @param value The `int64` to add the buffer.
     */
    addInt64(value) {
        this.prep(8, 0);
        this.writeInt64(value);
    }
    /**
     * Add a `float32` to the buffer, properly aligned, and grows the buffer (if necessary).
     * @param value The `float32` to add the buffer.
     */
    addFloat32(value) {
        this.prep(4, 0);
        this.writeFloat32(value);
    }
    /**
     * Add a `float64` to the buffer, properly aligned, and grows the buffer (if necessary).
     * @param value The `float64` to add the buffer.
     */
    addFloat64(value) {
        this.prep(8, 0);
        this.writeFloat64(value);
    }
    addFieldInt8(voffset, value, defaultValue) {
        if (this.force_defaults || value != defaultValue) {
            this.addInt8(value);
            this.slot(voffset);
        }
    }
    addFieldInt16(voffset, value, defaultValue) {
        if (this.force_defaults || value != defaultValue) {
            this.addInt16(value);
            this.slot(voffset);
        }
    }
    addFieldInt32(voffset, value, defaultValue) {
        if (this.force_defaults || value != defaultValue) {
            this.addInt32(value);
            this.slot(voffset);
        }
    }
    addFieldInt64(voffset, value, defaultValue) {
        if (this.force_defaults || value !== defaultValue) {
            this.addInt64(value);
            this.slot(voffset);
        }
    }
    addFieldFloat32(voffset, value, defaultValue) {
        if (this.force_defaults || value != defaultValue) {
            this.addFloat32(value);
            this.slot(voffset);
        }
    }
    addFieldFloat64(voffset, value, defaultValue) {
        if (this.force_defaults || value != defaultValue) {
            this.addFloat64(value);
            this.slot(voffset);
        }
    }
    addFieldOffset(voffset, value, defaultValue) {
        if (this.force_defaults || value != defaultValue) {
            this.addOffset(value);
            this.slot(voffset);
        }
    }
    /**
     * Structs are stored inline, so nothing additional is being added. `d` is always 0.
     */
    addFieldStruct(voffset, value, defaultValue) {
        if (value != defaultValue) {
            this.nested(value);
            this.slot(voffset);
        }
    }
    /**
     * Structures are always stored inline, they need to be created right
     * where they're used.  You'll get this assertion failure if you
     * created it elsewhere.
     */
    nested(obj) {
        if (obj != this.offset()) {
            throw new TypeError('FlatBuffers: struct must be serialized inline.');
        }
    }
    /**
     * Should not be creating any other object, string or vector
     * while an object is being constructed
     */
    notNested() {
        if (this.isNested) {
            throw new TypeError('FlatBuffers: object serialization must not be nested.');
        }
    }
    /**
     * Set the current vtable at `voffset` to the current location in the buffer.
     */
    slot(voffset) {
        if (this.vtable !== null)
            this.vtable[voffset] = this.offset();
    }
    /**
     * @returns Offset relative to the end of the buffer.
     */
    offset() {
        return this.bb.capacity() - this.space;
    }
    /**
     * Doubles the size of the backing ByteBuffer and copies the old data towards
     * the end of the new buffer (since we build the buffer backwards).
     *
     * @param bb The current buffer with the existing data
     * @returns A new byte buffer with the old data copied
     * to it. The data is located at the end of the buffer.
     *
     * uint8Array.set() formally takes {Array<number>|ArrayBufferView}, so to pass
     * it a uint8Array we need to suppress the type check:
     * @suppress {checkTypes}
     */
    static growByteBuffer(bb) {
        const old_buf_size = bb.capacity();
        // Ensure we don't grow beyond what fits in an int.
        if (old_buf_size & 0xC0000000) {
            throw new Error('FlatBuffers: cannot grow buffer beyond 2 gigabytes.');
        }
        const new_buf_size = old_buf_size << 1;
        const nbb = ByteBuffer.allocate(new_buf_size);
        nbb.setPosition(new_buf_size - old_buf_size);
        nbb.bytes().set(bb.bytes(), new_buf_size - old_buf_size);
        return nbb;
    }
    /**
     * Adds on offset, relative to where it will be written.
     *
     * @param offset The offset to add.
     */
    addOffset(offset) {
        this.prep(SIZEOF_INT, 0); // Ensure alignment is already done.
        this.writeInt32(this.offset() - offset + SIZEOF_INT);
    }
    /**
     * Start encoding a new object in the buffer.  Users will not usually need to
     * call this directly. The FlatBuffers compiler will generate helper methods
     * that call this method internally.
     */
    startObject(numfields) {
        this.notNested();
        if (this.vtable == null) {
            this.vtable = [];
        }
        this.vtable_in_use = numfields;
        for (let i = 0; i < numfields; i++) {
            this.vtable[i] = 0; // This will push additional elements as needed
        }
        this.isNested = true;
        this.object_start = this.offset();
    }
    /**
     * Finish off writing the object that is under construction.
     *
     * @returns The offset to the object inside `dataBuffer`
     */
    endObject() {
        if (this.vtable == null || !this.isNested) {
            throw new Error('FlatBuffers: endObject called without startObject');
        }
        this.addInt32(0);
        const vtableloc = this.offset();
        // Trim trailing zeroes.
        let i = this.vtable_in_use - 1;
        // eslint-disable-next-line no-empty
        for (; i >= 0 && this.vtable[i] == 0; i--) { }
        const trimmed_size = i + 1;
        // Write out the current vtable.
        for (; i >= 0; i--) {
            // Offset relative to the start of the table.
            this.addInt16(this.vtable[i] != 0 ? vtableloc - this.vtable[i] : 0);
        }
        const standard_fields = 2; // The fields below:
        this.addInt16(vtableloc - this.object_start);
        const len = (trimmed_size + standard_fields) * SIZEOF_SHORT;
        this.addInt16(len);
        // Search for an existing vtable that matches the current one.
        let existing_vtable = 0;
        const vt1 = this.space;
        outer_loop: for (i = 0; i < this.vtables.length; i++) {
            const vt2 = this.bb.capacity() - this.vtables[i];
            if (len == this.bb.readInt16(vt2)) {
                for (let j = SIZEOF_SHORT; j < len; j += SIZEOF_SHORT) {
                    if (this.bb.readInt16(vt1 + j) != this.bb.readInt16(vt2 + j)) {
                        continue outer_loop;
                    }
                }
                existing_vtable = this.vtables[i];
                break;
            }
        }
        if (existing_vtable) {
            // Found a match:
            // Remove the current vtable.
            this.space = this.bb.capacity() - vtableloc;
            // Point table to existing vtable.
            this.bb.writeInt32(this.space, existing_vtable - vtableloc);
        }
        else {
            // No match:
            // Add the location of the current vtable to the list of vtables.
            this.vtables.push(this.offset());
            // Point table to current vtable.
            this.bb.writeInt32(this.bb.capacity() - vtableloc, this.offset() - vtableloc);
        }
        this.isNested = false;
        return vtableloc;
    }
    /**
     * Finalize a buffer, poiting to the given `root_table`.
     */
    finish(root_table, opt_file_identifier, opt_size_prefix) {
        const size_prefix = opt_size_prefix ? SIZE_PREFIX_LENGTH : 0;
        if (opt_file_identifier) {
            const file_identifier = opt_file_identifier;
            this.prep(this.minalign, SIZEOF_INT +
                FILE_IDENTIFIER_LENGTH + size_prefix);
            if (file_identifier.length != FILE_IDENTIFIER_LENGTH) {
                throw new TypeError('FlatBuffers: file identifier must be length ' +
                    FILE_IDENTIFIER_LENGTH);
            }
            for (let i = FILE_IDENTIFIER_LENGTH - 1; i >= 0; i--) {
                this.writeInt8(file_identifier.charCodeAt(i));
            }
        }
        this.prep(this.minalign, SIZEOF_INT + size_prefix);
        this.addOffset(root_table);
        if (size_prefix) {
            this.addInt32(this.bb.capacity() - this.space);
        }
        this.bb.setPosition(this.space);
    }
    /**
     * Finalize a size prefixed buffer, pointing to the given `root_table`.
     */
    finishSizePrefixed(root_table, opt_file_identifier) {
        this.finish(root_table, opt_file_identifier, true);
    }
    /**
     * This checks a required field has been set in a given table that has
     * just been constructed.
     */
    requiredField(table, field) {
        const table_start = this.bb.capacity() - table;
        const vtable_start = table_start - this.bb.readInt32(table_start);
        const ok = field < this.bb.readInt16(vtable_start) &&
            this.bb.readInt16(vtable_start + field) != 0;
        // If this fails, the caller will show what field needs to be set.
        if (!ok) {
            throw new TypeError('FlatBuffers: field ' + field + ' must be set');
        }
    }
    /**
     * Start a new array/vector of objects.  Users usually will not call
     * this directly. The FlatBuffers compiler will create a start/end
     * method for vector types in generated code.
     *
     * @param elem_size The size of each element in the array
     * @param num_elems The number of elements in the array
     * @param alignment The alignment of the array
     */
    startVector(elem_size, num_elems, alignment) {
        this.notNested();
        this.vector_num_elems = num_elems;
        this.prep(SIZEOF_INT, elem_size * num_elems);
        this.prep(alignment, elem_size * num_elems); // Just in case alignment > int.
    }
    /**
     * Finish off the creation of an array and all its elements. The array must be
     * created with `startVector`.
     *
     * @returns The offset at which the newly created array
     * starts.
     */
    endVector() {
        this.writeInt32(this.vector_num_elems);
        return this.offset();
    }
    /**
     * Encode the string `s` in the buffer using UTF-8. If the string passed has
     * already been seen, we return the offset of the already written string
     *
     * @param s The string to encode
     * @return The offset in the buffer where the encoded string starts
     */
    createSharedString(s) {
        if (!s) {
            return 0;
        }
        if (!this.string_maps) {
            this.string_maps = new Map();
        }
        if (this.string_maps.has(s)) {
            return this.string_maps.get(s);
        }
        const offset = this.createString(s);
        this.string_maps.set(s, offset);
        return offset;
    }
    /**
     * Encode the string `s` in the buffer using UTF-8. If a Uint8Array is passed
     * instead of a string, it is assumed to contain valid UTF-8 encoded data.
     *
     * @param s The string to encode
     * @return The offset in the buffer where the encoded string starts
     */
    createString(s) {
        if (s === null || s === undefined) {
            return 0;
        }
        let utf8;
        if (s instanceof Uint8Array) {
            utf8 = s;
        }
        else {
            utf8 = this.text_encoder.encode(s);
        }
        this.addInt8(0);
        this.startVector(1, utf8.length, 1);
        this.bb.setPosition(this.space -= utf8.length);
        this.bb.bytes().set(utf8, this.space);
        return this.endVector();
    }
    /**
     * Create a byte vector.
     *
     * @param v The bytes to add
     * @returns The offset in the buffer where the byte vector starts
     */
    createByteVector(v) {
        if (v === null || v === undefined) {
            return 0;
        }
        this.startVector(1, v.length, 1);
        this.bb.setPosition(this.space -= v.length);
        this.bb.bytes().set(v, this.space);
        return this.endVector();
    }
    /**
     * A helper function to pack an object
     *
     * @returns offset of obj
     */
    createObjectOffset(obj) {
        if (obj === null) {
            return 0;
        }
        if (typeof obj === 'string') {
            return this.createString(obj);
        }
        else {
            return obj.pack(this);
        }
    }
    /**
     * A helper function to pack a list of object
     *
     * @returns list of offsets of each non null object
     */
    createObjectOffsetList(list) {
        const ret = [];
        for (let i = 0; i < list.length; ++i) {
            const val = list[i];
            if (val !== null) {
                ret.push(this.createObjectOffset(val));
            }
            else {
                throw new TypeError('FlatBuffers: Argument for createObjectOffsetList cannot contain null.');
            }
        }
        return ret;
    }
    createStructOffsetList(list, startFunc) {
        startFunc(this, list.length);
        this.createObjectOffsetList(list.slice().reverse());
        return this.endVector();
    }
}

var flatbuffers = /*#__PURE__*/Object.freeze({
__proto__: null,
Builder: Builder,
ByteBuffer: ByteBuffer,
get Encoding () { return Encoding; },
FILE_IDENTIFIER_LENGTH: FILE_IDENTIFIER_LENGTH,
SIZEOF_INT: SIZEOF_INT,
SIZEOF_SHORT: SIZEOF_SHORT,
SIZE_PREFIX_LENGTH: SIZE_PREFIX_LENGTH,
float32: float32,
float64: float64,
int32: int32,
isLittleEndian: isLittleEndian
});

var require$$0 = /*@__PURE__*/getAugmentedNamespace(flatbuffers);

var weatherApiResponse = {};

var model = {};

var hasRequiredModel;

function requireModel () {
	if (hasRequiredModel) return model;
	hasRequiredModel = 1;
	// automatically generated by the FlatBuffers compiler, do not modify
	Object.defineProperty(model, "__esModule", { value: true });
	model.Model = void 0;
	/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-non-null-assertion */
	var Model;
	(function (Model) {
	    Model[Model["undefined"] = 0] = "undefined";
	    Model[Model["best_match"] = 1] = "best_match";
	    Model[Model["gfs_seamless"] = 2] = "gfs_seamless";
	    Model[Model["gfs_global"] = 3] = "gfs_global";
	    Model[Model["gfs_hrrr"] = 4] = "gfs_hrrr";
	    Model[Model["meteofrance_seamless"] = 5] = "meteofrance_seamless";
	    Model[Model["meteofrance_arpege_seamless"] = 6] = "meteofrance_arpege_seamless";
	    Model[Model["meteofrance_arpege_world"] = 7] = "meteofrance_arpege_world";
	    Model[Model["meteofrance_arpege_europe"] = 8] = "meteofrance_arpege_europe";
	    Model[Model["meteofrance_arome_seamless"] = 9] = "meteofrance_arome_seamless";
	    Model[Model["meteofrance_arome_france"] = 10] = "meteofrance_arome_france";
	    Model[Model["meteofrance_arome_france_hd"] = 11] = "meteofrance_arome_france_hd";
	    Model[Model["jma_seamless"] = 12] = "jma_seamless";
	    Model[Model["jma_msm"] = 13] = "jma_msm";
	    Model[Model["jms_gsm"] = 14] = "jms_gsm";
	    Model[Model["jma_gsm"] = 15] = "jma_gsm";
	    Model[Model["gem_seamless"] = 16] = "gem_seamless";
	    Model[Model["gem_global"] = 17] = "gem_global";
	    Model[Model["gem_regional"] = 18] = "gem_regional";
	    Model[Model["gem_hrdps_continental"] = 19] = "gem_hrdps_continental";
	    Model[Model["icon_seamless"] = 20] = "icon_seamless";
	    Model[Model["icon_global"] = 21] = "icon_global";
	    Model[Model["icon_eu"] = 22] = "icon_eu";
	    Model[Model["icon_d2"] = 23] = "icon_d2";
	    Model[Model["ecmwf_ifs04"] = 24] = "ecmwf_ifs04";
	    Model[Model["metno_nordic"] = 25] = "metno_nordic";
	    Model[Model["era5_seamless"] = 26] = "era5_seamless";
	    Model[Model["era5"] = 27] = "era5";
	    Model[Model["cerra"] = 28] = "cerra";
	    Model[Model["era5_land"] = 29] = "era5_land";
	    Model[Model["ecmwf_ifs"] = 30] = "ecmwf_ifs";
	    Model[Model["gwam"] = 31] = "gwam";
	    Model[Model["ewam"] = 32] = "ewam";
	    Model[Model["glofas_seamless_v3"] = 33] = "glofas_seamless_v3";
	    Model[Model["glofas_forecast_v3"] = 34] = "glofas_forecast_v3";
	    Model[Model["glofas_consolidated_v3"] = 35] = "glofas_consolidated_v3";
	    Model[Model["glofas_seamless_v4"] = 36] = "glofas_seamless_v4";
	    Model[Model["glofas_forecast_v4"] = 37] = "glofas_forecast_v4";
	    Model[Model["glofas_consolidated_v4"] = 38] = "glofas_consolidated_v4";
	    Model[Model["gfs025"] = 39] = "gfs025";
	    Model[Model["gfs05"] = 40] = "gfs05";
	    Model[Model["CMCC_CM2_VHR4"] = 41] = "CMCC_CM2_VHR4";
	    Model[Model["FGOALS_f3_H_highresSST"] = 42] = "FGOALS_f3_H_highresSST";
	    Model[Model["FGOALS_f3_H"] = 43] = "FGOALS_f3_H";
	    Model[Model["HiRAM_SIT_HR"] = 44] = "HiRAM_SIT_HR";
	    Model[Model["MRI_AGCM3_2_S"] = 45] = "MRI_AGCM3_2_S";
	    Model[Model["EC_Earth3P_HR"] = 46] = "EC_Earth3P_HR";
	    Model[Model["MPI_ESM1_2_XR"] = 47] = "MPI_ESM1_2_XR";
	    Model[Model["NICAM16_8S"] = 48] = "NICAM16_8S";
	    Model[Model["cams_europe"] = 49] = "cams_europe";
	    Model[Model["cams_global"] = 50] = "cams_global";
	    Model[Model["cfsv2"] = 51] = "cfsv2";
	    Model[Model["era5_ocean"] = 52] = "era5_ocean";
	    Model[Model["cma_grapes_global"] = 53] = "cma_grapes_global";
	    Model[Model["bom_access_global"] = 54] = "bom_access_global";
	    Model[Model["bom_access_global_ensemble"] = 55] = "bom_access_global_ensemble";
	    Model[Model["arpae_cosmo_seamless"] = 56] = "arpae_cosmo_seamless";
	    Model[Model["arpae_cosmo_2i"] = 57] = "arpae_cosmo_2i";
	    Model[Model["arpae_cosmo_2i_ruc"] = 58] = "arpae_cosmo_2i_ruc";
	    Model[Model["arpae_cosmo_5m"] = 59] = "arpae_cosmo_5m";
	    Model[Model["ecmwf_ifs025"] = 60] = "ecmwf_ifs025";
	    Model[Model["ecmwf_aifs025"] = 61] = "ecmwf_aifs025";
	    Model[Model["gfs013"] = 62] = "gfs013";
	    Model[Model["gfs_graphcast025"] = 63] = "gfs_graphcast025";
	    Model[Model["ecmwf_wam025"] = 64] = "ecmwf_wam025";
	    Model[Model["meteofrance_wave"] = 65] = "meteofrance_wave";
	    Model[Model["meteofrance_currents"] = 66] = "meteofrance_currents";
	    Model[Model["ecmwf_wam025_ensemble"] = 67] = "ecmwf_wam025_ensemble";
	    Model[Model["ncep_gfswave025"] = 68] = "ncep_gfswave025";
	    Model[Model["ncep_gefswave025"] = 69] = "ncep_gefswave025";
	    Model[Model["knmi_seamless"] = 70] = "knmi_seamless";
	    Model[Model["knmi_harmonie_arome_europe"] = 71] = "knmi_harmonie_arome_europe";
	    Model[Model["knmi_harmonie_arome_netherlands"] = 72] = "knmi_harmonie_arome_netherlands";
	    Model[Model["dmi_seamless"] = 73] = "dmi_seamless";
	    Model[Model["dmi_harmonie_arome_europe"] = 74] = "dmi_harmonie_arome_europe";
	    Model[Model["metno_seamless"] = 75] = "metno_seamless";
	    Model[Model["era5_ensemble"] = 76] = "era5_ensemble";
	    Model[Model["ecmwf_ifs_analysis"] = 77] = "ecmwf_ifs_analysis";
	    Model[Model["ecmwf_ifs_long_window"] = 78] = "ecmwf_ifs_long_window";
	    Model[Model["ecmwf_ifs_analysis_long_window"] = 79] = "ecmwf_ifs_analysis_long_window";
	    Model[Model["ukmo_global_deterministic_10km"] = 80] = "ukmo_global_deterministic_10km";
	    Model[Model["ukmo_uk_deterministic_2km"] = 81] = "ukmo_uk_deterministic_2km";
	    Model[Model["ukmo_seamless"] = 82] = "ukmo_seamless";
	    Model[Model["ncep_gfswave016"] = 83] = "ncep_gfswave016";
	    Model[Model["ncep_nbm_conus"] = 84] = "ncep_nbm_conus";
	    Model[Model["ukmo_global_ensemble_20km"] = 85] = "ukmo_global_ensemble_20km";
	    Model[Model["ecmwf_aifs025_single"] = 86] = "ecmwf_aifs025_single";
	    Model[Model["jma_jaxa_himawari"] = 87] = "jma_jaxa_himawari";
	    Model[Model["eumetsat_sarah3"] = 88] = "eumetsat_sarah3";
	    Model[Model["eumetsat_lsa_saf_msg"] = 89] = "eumetsat_lsa_saf_msg";
	    Model[Model["eumetsat_lsa_saf_iodc"] = 90] = "eumetsat_lsa_saf_iodc";
	    Model[Model["satellite_radiation_seamless"] = 91] = "satellite_radiation_seamless";
	    Model[Model["kma_gdps"] = 92] = "kma_gdps";
	    Model[Model["kma_ldps"] = 93] = "kma_ldps";
	    Model[Model["kma_seamless"] = 94] = "kma_seamless";
	    Model[Model["italia_meteo_arpae_icon_2i"] = 95] = "italia_meteo_arpae_icon_2i";
	})(Model || (model.Model = Model = {}));
	return model;
}

var variablesWithTime = {};

var variableWithValues = {};

var aggregation = {};

var hasRequiredAggregation;

function requireAggregation () {
	if (hasRequiredAggregation) return aggregation;
	hasRequiredAggregation = 1;
	// automatically generated by the FlatBuffers compiler, do not modify
	Object.defineProperty(aggregation, "__esModule", { value: true });
	aggregation.Aggregation = void 0;
	/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-non-null-assertion */
	var Aggregation;
	(function (Aggregation) {
	    Aggregation[Aggregation["none"] = 0] = "none";
	    Aggregation[Aggregation["minimum"] = 1] = "minimum";
	    Aggregation[Aggregation["maximum"] = 2] = "maximum";
	    Aggregation[Aggregation["mean"] = 3] = "mean";
	    Aggregation[Aggregation["p10"] = 4] = "p10";
	    Aggregation[Aggregation["p25"] = 5] = "p25";
	    Aggregation[Aggregation["median"] = 6] = "median";
	    Aggregation[Aggregation["p75"] = 7] = "p75";
	    Aggregation[Aggregation["p90"] = 8] = "p90";
	    Aggregation[Aggregation["dominant"] = 9] = "dominant";
	    Aggregation[Aggregation["sum"] = 10] = "sum";
	    Aggregation[Aggregation["spread"] = 11] = "spread";
	})(Aggregation || (aggregation.Aggregation = Aggregation = {}));
	return aggregation;
}

var unit = {};

var hasRequiredUnit;

function requireUnit () {
	if (hasRequiredUnit) return unit;
	hasRequiredUnit = 1;
	// automatically generated by the FlatBuffers compiler, do not modify
	Object.defineProperty(unit, "__esModule", { value: true });
	unit.Unit = void 0;
	/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-non-null-assertion */
	var Unit;
	(function (Unit) {
	    Unit[Unit["undefined"] = 0] = "undefined";
	    Unit[Unit["celsius"] = 1] = "celsius";
	    Unit[Unit["centimetre"] = 2] = "centimetre";
	    Unit[Unit["cubic_metre_per_cubic_metre"] = 3] = "cubic_metre_per_cubic_metre";
	    Unit[Unit["cubic_metre_per_second"] = 4] = "cubic_metre_per_second";
	    Unit[Unit["degree_direction"] = 5] = "degree_direction";
	    Unit[Unit["dimensionless_integer"] = 6] = "dimensionless_integer";
	    Unit[Unit["dimensionless"] = 7] = "dimensionless";
	    Unit[Unit["european_air_quality_index"] = 8] = "european_air_quality_index";
	    Unit[Unit["fahrenheit"] = 9] = "fahrenheit";
	    Unit[Unit["feet"] = 10] = "feet";
	    Unit[Unit["fraction"] = 11] = "fraction";
	    Unit[Unit["gdd_celsius"] = 12] = "gdd_celsius";
	    Unit[Unit["geopotential_metre"] = 13] = "geopotential_metre";
	    Unit[Unit["grains_per_cubic_metre"] = 14] = "grains_per_cubic_metre";
	    Unit[Unit["gram_per_kilogram"] = 15] = "gram_per_kilogram";
	    Unit[Unit["hectopascal"] = 16] = "hectopascal";
	    Unit[Unit["hours"] = 17] = "hours";
	    Unit[Unit["inch"] = 18] = "inch";
	    Unit[Unit["iso8601"] = 19] = "iso8601";
	    Unit[Unit["joule_per_kilogram"] = 20] = "joule_per_kilogram";
	    Unit[Unit["kelvin"] = 21] = "kelvin";
	    Unit[Unit["kilopascal"] = 22] = "kilopascal";
	    Unit[Unit["kilogram_per_square_metre"] = 23] = "kilogram_per_square_metre";
	    Unit[Unit["kilometres_per_hour"] = 24] = "kilometres_per_hour";
	    Unit[Unit["knots"] = 25] = "knots";
	    Unit[Unit["megajoule_per_square_metre"] = 26] = "megajoule_per_square_metre";
	    Unit[Unit["metre_per_second_not_unit_converted"] = 27] = "metre_per_second_not_unit_converted";
	    Unit[Unit["metre_per_second"] = 28] = "metre_per_second";
	    Unit[Unit["metre"] = 29] = "metre";
	    Unit[Unit["micrograms_per_cubic_metre"] = 30] = "micrograms_per_cubic_metre";
	    Unit[Unit["miles_per_hour"] = 31] = "miles_per_hour";
	    Unit[Unit["millimetre"] = 32] = "millimetre";
	    Unit[Unit["pascal"] = 33] = "pascal";
	    Unit[Unit["per_second"] = 34] = "per_second";
	    Unit[Unit["percentage"] = 35] = "percentage";
	    Unit[Unit["seconds"] = 36] = "seconds";
	    Unit[Unit["unix_time"] = 37] = "unix_time";
	    Unit[Unit["us_air_quality_index"] = 38] = "us_air_quality_index";
	    Unit[Unit["watt_per_square_metre"] = 39] = "watt_per_square_metre";
	    Unit[Unit["wmo_code"] = 40] = "wmo_code";
	    Unit[Unit["parts_per_million"] = 41] = "parts_per_million";
	})(Unit || (unit.Unit = Unit = {}));
	return unit;
}

var variable = {};

var hasRequiredVariable;

function requireVariable () {
	if (hasRequiredVariable) return variable;
	hasRequiredVariable = 1;
	// automatically generated by the FlatBuffers compiler, do not modify
	Object.defineProperty(variable, "__esModule", { value: true });
	variable.Variable = void 0;
	/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-non-null-assertion */
	var Variable;
	(function (Variable) {
	    Variable[Variable["undefined"] = 0] = "undefined";
	    Variable[Variable["apparent_temperature"] = 1] = "apparent_temperature";
	    Variable[Variable["cape"] = 2] = "cape";
	    Variable[Variable["cloud_cover"] = 3] = "cloud_cover";
	    Variable[Variable["cloud_cover_high"] = 4] = "cloud_cover_high";
	    Variable[Variable["cloud_cover_low"] = 5] = "cloud_cover_low";
	    Variable[Variable["cloud_cover_mid"] = 6] = "cloud_cover_mid";
	    Variable[Variable["daylight_duration"] = 7] = "daylight_duration";
	    Variable[Variable["dew_point"] = 8] = "dew_point";
	    Variable[Variable["diffuse_radiation"] = 9] = "diffuse_radiation";
	    Variable[Variable["diffuse_radiation_instant"] = 10] = "diffuse_radiation_instant";
	    Variable[Variable["direct_normal_irradiance"] = 11] = "direct_normal_irradiance";
	    Variable[Variable["direct_normal_irradiance_instant"] = 12] = "direct_normal_irradiance_instant";
	    Variable[Variable["direct_radiation"] = 13] = "direct_radiation";
	    Variable[Variable["direct_radiation_instant"] = 14] = "direct_radiation_instant";
	    Variable[Variable["et0_fao_evapotranspiration"] = 15] = "et0_fao_evapotranspiration";
	    Variable[Variable["evapotranspiration"] = 16] = "evapotranspiration";
	    Variable[Variable["freezing_level_height"] = 17] = "freezing_level_height";
	    Variable[Variable["growing_degree_days"] = 18] = "growing_degree_days";
	    Variable[Variable["is_day"] = 19] = "is_day";
	    Variable[Variable["latent_heat_flux"] = 20] = "latent_heat_flux";
	    Variable[Variable["leaf_wetness_probability"] = 21] = "leaf_wetness_probability";
	    Variable[Variable["lifted_index"] = 22] = "lifted_index";
	    Variable[Variable["lightning_potential"] = 23] = "lightning_potential";
	    Variable[Variable["precipitation"] = 24] = "precipitation";
	    Variable[Variable["precipitation_hours"] = 25] = "precipitation_hours";
	    Variable[Variable["precipitation_probability"] = 26] = "precipitation_probability";
	    Variable[Variable["pressure_msl"] = 27] = "pressure_msl";
	    Variable[Variable["rain"] = 28] = "rain";
	    Variable[Variable["relative_humidity"] = 29] = "relative_humidity";
	    Variable[Variable["runoff"] = 30] = "runoff";
	    Variable[Variable["sensible_heat_flux"] = 31] = "sensible_heat_flux";
	    Variable[Variable["shortwave_radiation"] = 32] = "shortwave_radiation";
	    Variable[Variable["shortwave_radiation_instant"] = 33] = "shortwave_radiation_instant";
	    Variable[Variable["showers"] = 34] = "showers";
	    Variable[Variable["snow_depth"] = 35] = "snow_depth";
	    Variable[Variable["snow_height"] = 36] = "snow_height";
	    Variable[Variable["snowfall"] = 37] = "snowfall";
	    Variable[Variable["snowfall_height"] = 38] = "snowfall_height";
	    Variable[Variable["snowfall_water_equivalent"] = 39] = "snowfall_water_equivalent";
	    Variable[Variable["sunrise"] = 40] = "sunrise";
	    Variable[Variable["sunset"] = 41] = "sunset";
	    Variable[Variable["soil_moisture"] = 42] = "soil_moisture";
	    Variable[Variable["soil_moisture_index"] = 43] = "soil_moisture_index";
	    Variable[Variable["soil_temperature"] = 44] = "soil_temperature";
	    Variable[Variable["surface_pressure"] = 45] = "surface_pressure";
	    Variable[Variable["surface_temperature"] = 46] = "surface_temperature";
	    Variable[Variable["temperature"] = 47] = "temperature";
	    Variable[Variable["terrestrial_radiation"] = 48] = "terrestrial_radiation";
	    Variable[Variable["terrestrial_radiation_instant"] = 49] = "terrestrial_radiation_instant";
	    Variable[Variable["total_column_integrated_water_vapour"] = 50] = "total_column_integrated_water_vapour";
	    Variable[Variable["updraft"] = 51] = "updraft";
	    Variable[Variable["uv_index"] = 52] = "uv_index";
	    Variable[Variable["uv_index_clear_sky"] = 53] = "uv_index_clear_sky";
	    Variable[Variable["vapour_pressure_deficit"] = 54] = "vapour_pressure_deficit";
	    Variable[Variable["visibility"] = 55] = "visibility";
	    Variable[Variable["weather_code"] = 56] = "weather_code";
	    Variable[Variable["wind_direction"] = 57] = "wind_direction";
	    Variable[Variable["wind_gusts"] = 58] = "wind_gusts";
	    Variable[Variable["wind_speed"] = 59] = "wind_speed";
	    Variable[Variable["vertical_velocity"] = 60] = "vertical_velocity";
	    Variable[Variable["geopotential_height"] = 61] = "geopotential_height";
	    Variable[Variable["wet_bulb_temperature"] = 62] = "wet_bulb_temperature";
	    Variable[Variable["river_discharge"] = 63] = "river_discharge";
	    Variable[Variable["wave_height"] = 64] = "wave_height";
	    Variable[Variable["wave_period"] = 65] = "wave_period";
	    Variable[Variable["wave_direction"] = 66] = "wave_direction";
	    Variable[Variable["wind_wave_height"] = 67] = "wind_wave_height";
	    Variable[Variable["wind_wave_period"] = 68] = "wind_wave_period";
	    Variable[Variable["wind_wave_peak_period"] = 69] = "wind_wave_peak_period";
	    Variable[Variable["wind_wave_direction"] = 70] = "wind_wave_direction";
	    Variable[Variable["swell_wave_height"] = 71] = "swell_wave_height";
	    Variable[Variable["swell_wave_period"] = 72] = "swell_wave_period";
	    Variable[Variable["swell_wave_peak_period"] = 73] = "swell_wave_peak_period";
	    Variable[Variable["swell_wave_direction"] = 74] = "swell_wave_direction";
	    Variable[Variable["pm10"] = 75] = "pm10";
	    Variable[Variable["pm2p5"] = 76] = "pm2p5";
	    Variable[Variable["dust"] = 77] = "dust";
	    Variable[Variable["aerosol_optical_depth"] = 78] = "aerosol_optical_depth";
	    Variable[Variable["carbon_monoxide"] = 79] = "carbon_monoxide";
	    Variable[Variable["nitrogen_dioxide"] = 80] = "nitrogen_dioxide";
	    Variable[Variable["ammonia"] = 81] = "ammonia";
	    Variable[Variable["ozone"] = 82] = "ozone";
	    Variable[Variable["sulphur_dioxide"] = 83] = "sulphur_dioxide";
	    Variable[Variable["alder_pollen"] = 84] = "alder_pollen";
	    Variable[Variable["birch_pollen"] = 85] = "birch_pollen";
	    Variable[Variable["grass_pollen"] = 86] = "grass_pollen";
	    Variable[Variable["mugwort_pollen"] = 87] = "mugwort_pollen";
	    Variable[Variable["olive_pollen"] = 88] = "olive_pollen";
	    Variable[Variable["ragweed_pollen"] = 89] = "ragweed_pollen";
	    Variable[Variable["european_aqi"] = 90] = "european_aqi";
	    Variable[Variable["european_aqi_pm2p5"] = 91] = "european_aqi_pm2p5";
	    Variable[Variable["european_aqi_pm10"] = 92] = "european_aqi_pm10";
	    Variable[Variable["european_aqi_nitrogen_dioxide"] = 93] = "european_aqi_nitrogen_dioxide";
	    Variable[Variable["european_aqi_ozone"] = 94] = "european_aqi_ozone";
	    Variable[Variable["european_aqi_sulphur_dioxide"] = 95] = "european_aqi_sulphur_dioxide";
	    Variable[Variable["us_aqi"] = 96] = "us_aqi";
	    Variable[Variable["us_aqi_pm2p5"] = 97] = "us_aqi_pm2p5";
	    Variable[Variable["us_aqi_pm10"] = 98] = "us_aqi_pm10";
	    Variable[Variable["us_aqi_nitrogen_dioxide"] = 99] = "us_aqi_nitrogen_dioxide";
	    Variable[Variable["us_aqi_ozone"] = 100] = "us_aqi_ozone";
	    Variable[Variable["us_aqi_sulphur_dioxide"] = 101] = "us_aqi_sulphur_dioxide";
	    Variable[Variable["us_aqi_carbon_monoxide"] = 102] = "us_aqi_carbon_monoxide";
	    Variable[Variable["sunshine_duration"] = 103] = "sunshine_duration";
	    Variable[Variable["convective_inhibition"] = 104] = "convective_inhibition";
	    Variable[Variable["shortwave_radiation_clear_sky"] = 105] = "shortwave_radiation_clear_sky";
	    Variable[Variable["global_tilted_irradiance"] = 106] = "global_tilted_irradiance";
	    Variable[Variable["global_tilted_irradiance_instant"] = 107] = "global_tilted_irradiance_instant";
	    Variable[Variable["ocean_current_velocity"] = 108] = "ocean_current_velocity";
	    Variable[Variable["ocean_current_direction"] = 109] = "ocean_current_direction";
	    Variable[Variable["cloud_base"] = 110] = "cloud_base";
	    Variable[Variable["cloud_top"] = 111] = "cloud_top";
	    Variable[Variable["mass_density"] = 112] = "mass_density";
	    Variable[Variable["boundary_layer_height"] = 113] = "boundary_layer_height";
	    Variable[Variable["formaldehyde"] = 114] = "formaldehyde";
	    Variable[Variable["glyoxal"] = 115] = "glyoxal";
	    Variable[Variable["non_methane_volatile_organic_compounds"] = 116] = "non_methane_volatile_organic_compounds";
	    Variable[Variable["pm10_wildfires"] = 117] = "pm10_wildfires";
	    Variable[Variable["peroxyacyl_nitrates"] = 118] = "peroxyacyl_nitrates";
	    Variable[Variable["secondary_inorganic_aerosol"] = 119] = "secondary_inorganic_aerosol";
	    Variable[Variable["residential_elementary_carbon"] = 120] = "residential_elementary_carbon";
	    Variable[Variable["total_elementary_carbon"] = 121] = "total_elementary_carbon";
	    Variable[Variable["pm2_5_total_organic_matter"] = 122] = "pm2_5_total_organic_matter";
	    Variable[Variable["sea_salt_aerosol"] = 123] = "sea_salt_aerosol";
	    Variable[Variable["nitrogen_monoxide"] = 124] = "nitrogen_monoxide";
	    Variable[Variable["thunderstorm_probability"] = 125] = "thunderstorm_probability";
	    Variable[Variable["rain_probability"] = 126] = "rain_probability";
	    Variable[Variable["freezing_rain_probability"] = 127] = "freezing_rain_probability";
	    Variable[Variable["ice_pellets_probability"] = 128] = "ice_pellets_probability";
	    Variable[Variable["snowfall_probability"] = 129] = "snowfall_probability";
	    Variable[Variable["carbon_dioxide"] = 130] = "carbon_dioxide";
	    Variable[Variable["methane"] = 131] = "methane";
	    Variable[Variable["sea_level_height_msl"] = 132] = "sea_level_height_msl";
	    Variable[Variable["sea_surface_temperature"] = 133] = "sea_surface_temperature";
	    Variable[Variable["invert_barometer_height"] = 134] = "invert_barometer_height";
	    Variable[Variable["hail"] = 135] = "hail";
	    Variable[Variable["albedo"] = 136] = "albedo";
	    Variable[Variable["precipitation_type"] = 137] = "precipitation_type";
	    Variable[Variable["convective_cloud_base"] = 138] = "convective_cloud_base";
	    Variable[Variable["convective_cloud_top"] = 139] = "convective_cloud_top";
	    Variable[Variable["snow_depth_water_equivalent"] = 140] = "snow_depth_water_equivalent";
	    Variable[Variable["secondary_swell_wave_height"] = 141] = "secondary_swell_wave_height";
	    Variable[Variable["secondary_swell_wave_period"] = 142] = "secondary_swell_wave_period";
	    Variable[Variable["secondary_swell_wave_peak_period"] = 143] = "secondary_swell_wave_peak_period";
	    Variable[Variable["secondary_swell_wave_direction"] = 144] = "secondary_swell_wave_direction";
	    Variable[Variable["tertiary_swell_wave_height"] = 145] = "tertiary_swell_wave_height";
	    Variable[Variable["tertiary_swell_wave_period"] = 146] = "tertiary_swell_wave_period";
	    Variable[Variable["tertiary_swell_wave_peak_period"] = 147] = "tertiary_swell_wave_peak_period";
	    Variable[Variable["tertiary_swell_wave_direction"] = 148] = "tertiary_swell_wave_direction";
	})(Variable || (variable.Variable = Variable = {}));
	return variable;
}

var hasRequiredVariableWithValues;

function requireVariableWithValues () {
	if (hasRequiredVariableWithValues) return variableWithValues;
	hasRequiredVariableWithValues = 1;
	// automatically generated by the FlatBuffers compiler, do not modify
	var __createBinding = (variableWithValues && variableWithValues.__createBinding) || (Object.create ? (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    var desc = Object.getOwnPropertyDescriptor(m, k);
	    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
	      desc = { enumerable: true, get: function() { return m[k]; } };
	    }
	    Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    o[k2] = m[k];
	}));
	var __setModuleDefault = (variableWithValues && variableWithValues.__setModuleDefault) || (Object.create ? (function(o, v) {
	    Object.defineProperty(o, "default", { enumerable: true, value: v });
	}) : function(o, v) {
	    o["default"] = v;
	});
	var __importStar = (variableWithValues && variableWithValues.__importStar) || (function () {
	    var ownKeys = function(o) {
	        ownKeys = Object.getOwnPropertyNames || function (o) {
	            var ar = [];
	            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
	            return ar;
	        };
	        return ownKeys(o);
	    };
	    return function (mod) {
	        if (mod && mod.__esModule) return mod;
	        var result = {};
	        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
	        __setModuleDefault(result, mod);
	        return result;
	    };
	})();
	Object.defineProperty(variableWithValues, "__esModule", { value: true });
	variableWithValues.VariableWithValues = void 0;
	/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-non-null-assertion */
	const flatbuffers = __importStar(require$$0);
	const aggregation_js_1 = requireAggregation();
	const unit_js_1 = requireUnit();
	const variable_js_1 = requireVariable();
	class VariableWithValues {
	    constructor() {
	        this.bb = null;
	        this.bb_pos = 0;
	    }
	    __init(i, bb) {
	        this.bb_pos = i;
	        this.bb = bb;
	        return this;
	    }
	    static getRootAsVariableWithValues(bb, obj) {
	        return (obj || new VariableWithValues()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
	    }
	    static getSizePrefixedRootAsVariableWithValues(bb, obj) {
	        bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
	        return (obj || new VariableWithValues()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
	    }
	    variable() {
	        const offset = this.bb.__offset(this.bb_pos, 4);
	        return offset ? this.bb.readUint8(this.bb_pos + offset) : variable_js_1.Variable.undefined;
	    }
	    unit() {
	        const offset = this.bb.__offset(this.bb_pos, 6);
	        return offset ? this.bb.readUint8(this.bb_pos + offset) : unit_js_1.Unit.undefined;
	    }
	    value() {
	        const offset = this.bb.__offset(this.bb_pos, 8);
	        return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
	    }
	    values(index) {
	        const offset = this.bb.__offset(this.bb_pos, 10);
	        return offset ? this.bb.readFloat32(this.bb.__vector(this.bb_pos + offset) + index * 4) : 0;
	    }
	    valuesLength() {
	        const offset = this.bb.__offset(this.bb_pos, 10);
	        return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
	    }
	    valuesArray() {
	        const offset = this.bb.__offset(this.bb_pos, 10);
	        return offset ? new Float32Array(this.bb.bytes().buffer, this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + offset), this.bb.__vector_len(this.bb_pos + offset)) : null;
	    }
	    valuesInt64(index) {
	        const offset = this.bb.__offset(this.bb_pos, 12);
	        return offset ? this.bb.readInt64(this.bb.__vector(this.bb_pos + offset) + index * 8) : BigInt(0);
	    }
	    valuesInt64Length() {
	        const offset = this.bb.__offset(this.bb_pos, 12);
	        return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
	    }
	    altitude() {
	        const offset = this.bb.__offset(this.bb_pos, 14);
	        return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
	    }
	    aggregation() {
	        const offset = this.bb.__offset(this.bb_pos, 16);
	        return offset ? this.bb.readUint8(this.bb_pos + offset) : aggregation_js_1.Aggregation.none;
	    }
	    pressureLevel() {
	        const offset = this.bb.__offset(this.bb_pos, 18);
	        return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
	    }
	    depth() {
	        const offset = this.bb.__offset(this.bb_pos, 20);
	        return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
	    }
	    depthTo() {
	        const offset = this.bb.__offset(this.bb_pos, 22);
	        return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
	    }
	    ensembleMember() {
	        const offset = this.bb.__offset(this.bb_pos, 24);
	        return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
	    }
	    previousDay() {
	        const offset = this.bb.__offset(this.bb_pos, 26);
	        return offset ? this.bb.readInt16(this.bb_pos + offset) : 0;
	    }
	}
	variableWithValues.VariableWithValues = VariableWithValues;
	return variableWithValues;
}

var hasRequiredVariablesWithTime;

function requireVariablesWithTime () {
	if (hasRequiredVariablesWithTime) return variablesWithTime;
	hasRequiredVariablesWithTime = 1;
	// automatically generated by the FlatBuffers compiler, do not modify
	var __createBinding = (variablesWithTime && variablesWithTime.__createBinding) || (Object.create ? (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    var desc = Object.getOwnPropertyDescriptor(m, k);
	    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
	      desc = { enumerable: true, get: function() { return m[k]; } };
	    }
	    Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    o[k2] = m[k];
	}));
	var __setModuleDefault = (variablesWithTime && variablesWithTime.__setModuleDefault) || (Object.create ? (function(o, v) {
	    Object.defineProperty(o, "default", { enumerable: true, value: v });
	}) : function(o, v) {
	    o["default"] = v;
	});
	var __importStar = (variablesWithTime && variablesWithTime.__importStar) || (function () {
	    var ownKeys = function(o) {
	        ownKeys = Object.getOwnPropertyNames || function (o) {
	            var ar = [];
	            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
	            return ar;
	        };
	        return ownKeys(o);
	    };
	    return function (mod) {
	        if (mod && mod.__esModule) return mod;
	        var result = {};
	        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
	        __setModuleDefault(result, mod);
	        return result;
	    };
	})();
	Object.defineProperty(variablesWithTime, "__esModule", { value: true });
	variablesWithTime.VariablesWithTime = void 0;
	/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-non-null-assertion */
	const flatbuffers = __importStar(require$$0);
	const variable_with_values_js_1 = requireVariableWithValues();
	class VariablesWithTime {
	    constructor() {
	        this.bb = null;
	        this.bb_pos = 0;
	    }
	    __init(i, bb) {
	        this.bb_pos = i;
	        this.bb = bb;
	        return this;
	    }
	    static getRootAsVariablesWithTime(bb, obj) {
	        return (obj || new VariablesWithTime()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
	    }
	    static getSizePrefixedRootAsVariablesWithTime(bb, obj) {
	        bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
	        return (obj || new VariablesWithTime()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
	    }
	    time() {
	        const offset = this.bb.__offset(this.bb_pos, 4);
	        return offset ? this.bb.readInt64(this.bb_pos + offset) : BigInt('0');
	    }
	    timeEnd() {
	        const offset = this.bb.__offset(this.bb_pos, 6);
	        return offset ? this.bb.readInt64(this.bb_pos + offset) : BigInt('0');
	    }
	    interval() {
	        const offset = this.bb.__offset(this.bb_pos, 8);
	        return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
	    }
	    variables(index, obj) {
	        const offset = this.bb.__offset(this.bb_pos, 10);
	        return offset ? (obj || new variable_with_values_js_1.VariableWithValues()).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
	    }
	    variablesLength() {
	        const offset = this.bb.__offset(this.bb_pos, 10);
	        return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
	    }
	}
	variablesWithTime.VariablesWithTime = VariablesWithTime;
	return variablesWithTime;
}

var hasRequiredWeatherApiResponse;

function requireWeatherApiResponse () {
	if (hasRequiredWeatherApiResponse) return weatherApiResponse;
	hasRequiredWeatherApiResponse = 1;
	// automatically generated by the FlatBuffers compiler, do not modify
	var __createBinding = (weatherApiResponse && weatherApiResponse.__createBinding) || (Object.create ? (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    var desc = Object.getOwnPropertyDescriptor(m, k);
	    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
	      desc = { enumerable: true, get: function() { return m[k]; } };
	    }
	    Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    o[k2] = m[k];
	}));
	var __setModuleDefault = (weatherApiResponse && weatherApiResponse.__setModuleDefault) || (Object.create ? (function(o, v) {
	    Object.defineProperty(o, "default", { enumerable: true, value: v });
	}) : function(o, v) {
	    o["default"] = v;
	});
	var __importStar = (weatherApiResponse && weatherApiResponse.__importStar) || (function () {
	    var ownKeys = function(o) {
	        ownKeys = Object.getOwnPropertyNames || function (o) {
	            var ar = [];
	            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
	            return ar;
	        };
	        return ownKeys(o);
	    };
	    return function (mod) {
	        if (mod && mod.__esModule) return mod;
	        var result = {};
	        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
	        __setModuleDefault(result, mod);
	        return result;
	    };
	})();
	Object.defineProperty(weatherApiResponse, "__esModule", { value: true });
	weatherApiResponse.WeatherApiResponse = void 0;
	/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-non-null-assertion */
	const flatbuffers = __importStar(require$$0);
	const model_js_1 = requireModel();
	const variables_with_time_js_1 = requireVariablesWithTime();
	class WeatherApiResponse {
	    constructor() {
	        this.bb = null;
	        this.bb_pos = 0;
	    }
	    __init(i, bb) {
	        this.bb_pos = i;
	        this.bb = bb;
	        return this;
	    }
	    static getRootAsWeatherApiResponse(bb, obj) {
	        return (obj || new WeatherApiResponse()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
	    }
	    static getSizePrefixedRootAsWeatherApiResponse(bb, obj) {
	        bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
	        return (obj || new WeatherApiResponse()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
	    }
	    latitude() {
	        const offset = this.bb.__offset(this.bb_pos, 4);
	        return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
	    }
	    longitude() {
	        const offset = this.bb.__offset(this.bb_pos, 6);
	        return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
	    }
	    elevation() {
	        const offset = this.bb.__offset(this.bb_pos, 8);
	        return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
	    }
	    generationTimeMilliseconds() {
	        const offset = this.bb.__offset(this.bb_pos, 10);
	        return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0;
	    }
	    locationId() {
	        const offset = this.bb.__offset(this.bb_pos, 12);
	        return offset ? this.bb.readInt64(this.bb_pos + offset) : BigInt('0');
	    }
	    model() {
	        const offset = this.bb.__offset(this.bb_pos, 14);
	        return offset ? this.bb.readUint8(this.bb_pos + offset) : model_js_1.Model.undefined;
	    }
	    utcOffsetSeconds() {
	        const offset = this.bb.__offset(this.bb_pos, 16);
	        return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
	    }
	    timezone(optionalEncoding) {
	        const offset = this.bb.__offset(this.bb_pos, 18);
	        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
	    }
	    timezoneAbbreviation(optionalEncoding) {
	        const offset = this.bb.__offset(this.bb_pos, 20);
	        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
	    }
	    current(obj) {
	        const offset = this.bb.__offset(this.bb_pos, 22);
	        return offset ? (obj || new variables_with_time_js_1.VariablesWithTime()).__init(this.bb.__indirect(this.bb_pos + offset), this.bb) : null;
	    }
	    daily(obj) {
	        const offset = this.bb.__offset(this.bb_pos, 24);
	        return offset ? (obj || new variables_with_time_js_1.VariablesWithTime()).__init(this.bb.__indirect(this.bb_pos + offset), this.bb) : null;
	    }
	    hourly(obj) {
	        const offset = this.bb.__offset(this.bb_pos, 26);
	        return offset ? (obj || new variables_with_time_js_1.VariablesWithTime()).__init(this.bb.__indirect(this.bb_pos + offset), this.bb) : null;
	    }
	    minutely15(obj) {
	        const offset = this.bb.__offset(this.bb_pos, 28);
	        return offset ? (obj || new variables_with_time_js_1.VariablesWithTime()).__init(this.bb.__indirect(this.bb_pos + offset), this.bb) : null;
	    }
	    sixHourly(obj) {
	        const offset = this.bb.__offset(this.bb_pos, 30);
	        return offset ? (obj || new variables_with_time_js_1.VariablesWithTime()).__init(this.bb.__indirect(this.bb_pos + offset), this.bb) : null;
	    }
	}
	weatherApiResponse.WeatherApiResponse = WeatherApiResponse;
	return weatherApiResponse;
}

var hasRequiredLib;

function requireLib () {
	if (hasRequiredLib) return lib;
	hasRequiredLib = 1;
	var __awaiter = (lib && lib.__awaiter) || function (thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	Object.defineProperty(lib, "__esModule", { value: true });
	lib.fetchWeatherApi = fetchWeatherApi;
	const flatbuffers_1 = require$$0;
	const weather_api_response_1 = requireWeatherApiResponse();
	const sleep = (ms) => new Promise(r => setTimeout(r, ms));
	function fetchRetried(url_1) {
	    return __awaiter(this, arguments, void 0, function* (url, retries = 3, backoffFactor = 0.5, backoffMax = 2, fetchOptions = {}) {
	        const statusToRetry = [500, 502, 504];
	        const statusWithJsonError = [400, 429];
	        let currentTry = 0;
	        let response = yield fetch(url, fetchOptions);
	        while (statusToRetry.includes(response.status)) {
	            currentTry++;
	            if (currentTry >= retries) {
	                throw new Error(response.statusText);
	            }
	            const sleepMs = Math.min(backoffFactor * Math.pow(2, currentTry), backoffMax) * 1000;
	            yield sleep(sleepMs);
	            response = yield fetch(url, fetchOptions);
	        }
	        if (statusWithJsonError.includes(response.status)) {
	            const json = yield response.json();
	            if ('reason' in json) {
	                throw new Error(json.reason);
	            }
	            throw new Error(response.statusText);
	        }
	        return response;
	    });
	}
	/**
	 * Retrieve data from the Open-Meteo weather API
	 *
	 * @param {string} url Server and endpoint. E.g. "https://api.open-meteo.com/v1/forecast"
	 * @param {any} params URL parameter as an object
	 * @param {number} [retries=3] Number of retries in case of an server error
	 * @param {number} [backoffFactor=0.2] Exponential backoff factor to increase wait time after each retry
	 * @param {number} [backoffMax=2] Maximum wait time between retries
	 * @param {RequestInit} [fetchOptions={}] Additional fetch options such as headers, signal, etc.
	 * @returns {Promise<WeatherApiResponse[]>}
	 */
	function fetchWeatherApi(url_1, params_1) {
	    return __awaiter(this, arguments, void 0, function* (url, params, retries = 3, backoffFactor = 0.2, backoffMax = 2, fetchOptions = {}) {
	        const urlParams = new URLSearchParams(params);
	        urlParams.set('format', 'flatbuffers');
	        const response = yield fetchRetried(`${url}?${urlParams.toString()}`, retries, backoffFactor, backoffMax, fetchOptions);
	        const fb = new flatbuffers_1.ByteBuffer(new Uint8Array(yield response.arrayBuffer()));
	        const results = [];
	        let pos = 0;
	        while (pos < fb.capacity()) {
	            fb.setPosition(pos);
	            const len = fb.readInt32(fb.position());
	            results.push(weather_api_response_1.WeatherApiResponse.getSizePrefixedRootAsWeatherApiResponse(fb));
	            pos += len + 4;
	        }
	        return results;
	    });
	}
	return lib;
}

var libExports = requireLib();

async function getIP() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching IP address:', error);
    return "127.0.0.1";
  }
}
async function getLocationInfo() {
  const ip = await getIP();
  const url = `http://www.geoplugin.net/json.gp?ip=${ip.ip}`;
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: "GET",
      url: url,
      onload: function (response) {
        try {
          const data = JSON.parse(response.responseText);
          const details = {
            latitude: data.geoplugin_latitude,
            longitude: data.geoplugin_longitude,
            city: data.geoplugin_city,
            region: data.geoplugin_regionName
          };
          console.log(details);
          resolve(details);
        } catch (err) {
          console.error("Parsing error:", err);
          reject(err);
        }
      },
      onerror: function (err) {
        console.error("GeoPlugin request failed:", err);
        reject(err);
      }
    });
  });
}
async function getLocation() {
  let data = await getLocationInfo();
  let latitude = data.latitude;
  let longitude = data.longitude;
  let name = data.city + ", " + data.region;
  return [latitude, longitude, name];
}

async function getWeatherData() {
  const loc_details = await getLocation();
  const params = {
    "latitude": parseFloat(loc_details[0]),
    "longitude": parseFloat(loc_details[1]),
    "hourly": "temperature_2m"
  };
  const url = "https://api.open-meteo.com/v1/forecast";
  const responses = await libExports.fetchWeatherApi(url, params);

  // Process first location. Add a for-loop for multiple locations or weather models
  const response = responses[0];

  // Attributes for timezone and location
  const utcOffsetSeconds = response.utcOffsetSeconds();
  response.timezone();
  response.timezoneAbbreviation();
  response.latitude();
  response.longitude();
  const hourly = response.hourly();

  // Note: The order of weather variables in the URL query and the indices below need to match!
  const weatherData = {
    hourly: {
      time: [...Array((Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval())].map((_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)),
      temperature2m: hourly.variables(0).valuesArray(),
      precipitationProbability: hourly.variables(1).valuesArray(),
      rain: hourly.variables(2).valuesArray(),
      snowfall: hourly.variables(3).valuesArray()
    }
  };
  return weatherData;
}

var _tmpl$ = /*#__PURE__*/template(`<div><p>Location: </p><p>Next hour:</p><p>`);
function Counter() {
  const [location, setLocation] = createSignal("Unknown");
  const [weather, setWeather] = createSignal({
    temp: 0,
    rain: 0,
    snow: 0,
    precip: 0
  });
  onMount(() => {
    getWeatherData().then(weatherData => {
      var _hourly$temperature2m, _hourly$rain, _hourly$snowfall, _hourly$precipitation;
      console.log(weatherData);
      const hourly = weatherData == null ? void 0 : weatherData.hourly;
      const partialWeather = {
        temp: null,
        rain: null,
        snow: null,
        precip: null
      };
      if ((hourly == null || (_hourly$temperature2m = hourly.temperature2m) == null ? void 0 : _hourly$temperature2m[0]) != null) {
        partialWeather.temp = hourly.temperature2m[0].toFixed(2);
      } else {
        console.warn("temperature2m data missing");
        delete partialWeather.temp;
      }
      if ((hourly == null || (_hourly$rain = hourly.rain) == null ? void 0 : _hourly$rain[0]) != null) {
        partialWeather.rain = hourly.rain[0].toFixed(2);
      } else {
        console.warn("rain data missing");
        delete partialWeather.rain;
      }
      if ((hourly == null || (_hourly$snowfall = hourly.snowfall) == null ? void 0 : _hourly$snowfall[0]) != null) {
        partialWeather.snow = hourly.snowfall[0].toFixed(2);
      } else {
        console.warn("snowfall data missing");
        delete partialWeather.snow;
      }
      if ((hourly == null || (_hourly$precipitation = hourly.precipitationProbability) == null ? void 0 : _hourly$precipitation[0]) != null) {
        partialWeather.precip = hourly.precipitationProbability[0].toFixed(2);
      } else {
        console.warn("precipitationProbability data missing");
        delete partialWeather.precip;
      }
      setWeather(prev => _extends({}, prev, partialWeather));
    }).catch(error => {
      console.error("Failed to get weather data:", error);
    });
    getLocation().then(loc => setLocation(loc[2])).catch(e => console.error("Location error", e));
  });
  console.log("Weather state:", weather());
  console.log(location());
  return (() => {
    var _el$ = _tmpl$(),
      _el$2 = _el$.firstChild;
      _el$2.firstChild;
      var _el$4 = _el$2.nextSibling,
      _el$5 = _el$4.nextSibling;
    insert(_el$2, location, null);
    insert(_el$5, (() => {
      var _c$ = memo(() => weather().temp != null);
      return () => _c$() && ` Temperature: ${weather().temp}°C`;
    })());
    return _el$;
  })();
}

// Inject CSS
GM_addStyle(css_248z);

// Let's create a movable panel using @violentmonkey/ui
const panel = ui.getPanel({
  theme: 'dark',
  // If shadowDOM is enabled for `getPanel` (by default), `style` will be injected to the shadow root.
  // Otherwise, it is roughly the same as `GM_addStyle(stylesheet)`.
  style: stylesheet
});
Object.assign(panel.wrapper.style, {
  top: '10vh',
  left: '10vw'
});
panel.setMovable(true);
panel.show();
render(Counter, panel.body);

})(VM);

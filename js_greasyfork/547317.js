// ==UserScript==
// @name         Anti-Visibility Cloak
// @namespace    https://spin.rip/
// @version      1.2.1
// @description  Force pages to always think the tab is visible/focused; optionally spoofs mouse as always "in page" and blocks exit/enter intent; shows a tiny popup when a visibility or mouse check is detected
// @author       Spinfal
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @all-frames   true
// @icon         https://cdn.spin.rip/r/antivisibility.png
// @license      gpl-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/547317/Anti-Visibility%20Cloak.user.js
// @updateURL https://update.greasyfork.org/scripts/547317/Anti-Visibility%20Cloak.meta.js
// ==/UserScript==
(function() {
  'use strict';

  // easy mode: flip these first
  const CONFIG = {
    // safety levels (start here)
    strictMode: false,        // stronger filtering + harder to undo patches
    paranoidMode: false,      // periodic re-apply + extra guards
    pageRealmPatch: false,     // also patch inside the page's own js realm

    // optional extras
    patchTimers: false,       // smooth over background throttling (raf/idle)
    patchPointerCapture: true,// soften pointer-capture based exit-intent
    exposeApi: true,          // controls/stats from API available via a random name

    // what to show in the tiny toast
    notify: {
      properties: true,       // toast when code reads visibility props
      hasFocusCall: false,    // toast when document.hasFocus() is called
      burstWindowMs: 400,     // collapse duplicate toasts within this window
      silentBootMs: 600,      // suppress toasts right after load

      // toast when listeners are added for these events
      addListener: {
        visibilitychange: true,
        webkitvisibilitychange: true,
        mozvisibilitychange: true,
        msvisibilitychange: true,
        pagehide: true,
        freeze: true,
        resume: true,
        pageshow: true,
        blur: false,
        focus: false,
        mouseout: true,
        mouseleave: true,
        pointerout: true,
        pointerleave: true,
        mouseover: true,
        mouseenter: true,
        pointerover: true,
        focusin: true,
        focusout: true,
        pointermove: false,
        mousemove: false
      },

      // toast when those listeners actually run
      invoke: {
        visibilitychange: true,
        webkitvisibilitychange: true,
        mozvisibilitychange: true,
        msvisibilitychange: true,
        pagehide: true,
        freeze: true,
        resume: true,
        pageshow: true,
        blur: false,
        focus: false,
        mouseout: false,
        mouseleave: false,
        pointerout: false,
        pointerleave: false,
        mouseover: false,
        mouseenter: false,
        pointerover: false,
        focusin: true,
        focusout: true,
        pointermove: false,
        mousemove: false
      }
    },

    // avoid spamming toasts when you focus text inputs
    suppressFocusOnEditable: true,

    // mouse presence + enter/exit intent controls
    mouse: {
      spoofExit: true,          // block exit-intent on window/doc/html/body
      ignoreGlobalLeave: true,  // swallow leave where relatedTarget is null
      blockGlobalEnter: true,   // swallow enter where relatedTarget is null
      initialEnterOnce: true,   // let exactly one global enter through after load

      // fake movement to look "alive"
      fakeMovement: true,       // periodically dispatch synthetic movement
      fakeIntervalMs: 12000,    // base interval between moves
      randomizeInterval: true,  // add ±30% jitter to the interval
      moveJitterPx: 2,          // small pixel jitter so it’s not robotic
      alsoPointerMove: true,    // emit pointermove alongside mousemove
      lightScrollNudge: false   // tiny scroll nudge (off by default)
    },

    focus: {
      blockGlobalBlur: true // swallow window/document/html/body blur & focusout
    }
  };

  /* ---------- just a separator to keep things clean ----------- */



  // stronger source for ids used on the API surface
  function secureRandomString(len = 16) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const buf = new Uint32Array(len);
    crypto.getRandomValues(buf);
    return Array.from(buf, n => chars[n % chars.length]).join('');
  }

  // stats counters for debugging
  const STATS = {
    addBlocked: Object.create(null),
    invokeSwallowed: Object.create(null),
    synthetic: Object.create(null),
    redefinitions: 0
  };

  // notifier (stealthier)
  const makeNotifier = () => {
    let shadow, wrap, root, last, lastAt = 0, hideTimer;
    const bootAt = Date.now();
    root = document.createElement('div');
    root.style.all = 'initial';
    root.style.position = 'fixed';
    root.style.zIndex = '2147483647';
    root.style.right = '10px';
    root.style.bottom = '10px';
    root.style.pointerEvents = 'none';
    shadow = root.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = `
      .wrap{font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:12px;line-height:1.2;background:#111;color:#fff;border-radius:8px;padding:8px 10px;box-shadow:0 2px 12px rgba(0,0,0,.35);opacity:.95;max-width:260px;pointer-events:auto;display:flex;gap:8px;align-items:start}
      .dot{width:8px;height:8px;border-radius:50%;background:#4ade80;margin-top:4px;flex:0 0 8px}
      .msg{white-space:pre-line}
      .hide{animation:fadeout .4s forwards}
      @keyframes fadeout{to{opacity:0;transform:translateY(4px)}}
    `;
    wrap = document.createElement('div');
    wrap.className = 'wrap';
    wrap.innerHTML = `<div class="dot"></div><div class="msg"></div>`;
    shadow.append(style, wrap);
    const set = (text) => {
      if ((Date.now() - bootAt) < (CONFIG.notify.silentBootMs|0)) return;
      if (!root.isConnected) document.documentElement.appendChild(root);
      wrap.querySelector('.msg').textContent = text;
      wrap.classList.remove('hide');
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        wrap.classList.add('hide');
        setTimeout(() => { if (root.isConnected) root.remove(); }, 450);
      }, 1600);
    };
    return (what) => {
      const now = Date.now();
      if (what === last && (now - lastAt) < (CONFIG.notify.burstWindowMs|0)) return;
      last = what; lastAt = now;
      set(`visibility/mouse check bypassed:\n${what}`);
    };
  };
  const notify = makeNotifier();

  // helpers
  const define = (target, key, descriptor) => {
    try {
      const desc = Object.getOwnPropertyDescriptor(target, key);
      if (desc && desc.configurable === false) return false;
      Object.defineProperty(target, key, { configurable: true, ...descriptor });
      return true;
    } catch { return false; }
  };
  const harden = (target, key, lock = {}) => {
    try {
      const d = Object.getOwnPropertyDescriptor(target, key);
      if (!d) return false;
      Object.defineProperty(target, key, {
        ...d,
        configurable: !!lock.configurable ? lock.configurable : false,
        writable: d.writable === true ? false : d.writable
      });
      return true;
    } catch { return false; }
  };
  const freezeFn = (fn) => { try { Object.freeze(fn); } catch {} return fn; };
  const asGlobalLike = (n) => (n===window || n===document || n===document.documentElement || n===document.body || n===window.visualViewport);

  // surface properties
  const forceVisibilityProps = () => {
    STATS.redefinitions++;
    const DocProto = Document.prototype;
    const HTMLDocProto = (window.HTMLDocument && HTMLDocument.prototype) || DocProto;
    const stableGet = (name, value) => function() {
      if (CONFIG.notify.properties) notify(`${name} read`);
      return value;
    };
    // main
    define(DocProto, 'visibilityState', { get: stableGet('document.visibilityState','visible') }) ||
      define(document, 'visibilityState', { get: stableGet('document.visibilityState','visible') });
    define(DocProto, 'hidden', { get: stableGet('document.hidden',false) }) ||
      define(document, 'hidden', { get: stableGet('document.hidden',false) });
    // legacy + aliases
    [['webkitVisibilityState','visible'],['mozVisibilityState','visible'],['msVisibilityState','visible'],
     ['webkitHidden',false],['mozHidden',false],['msHidden',false]].forEach(([k,v])=>{
      define(DocProto, k, { get: stableGet(`document.${k}`, v) }) ||
      define(document, k, { get: stableGet(`document.${k}`, v) });
    });
    // prerendering flag
    if ('prerendering' in document || DocProto.hasOwnProperty('prerendering')) {
      define(DocProto, 'prerendering', { get: stableGet('document.prerendering', false) }) ||
      define(document, 'prerendering', { get: stableGet('document.prerendering', false) });
    }
    // make sure htmldocument sees the same
    if (HTMLDocProto && HTMLDocProto !== DocProto) {
      define(HTMLDocProto, 'visibilityState', { get: stableGet('document.visibilityState','visible') });
      define(HTMLDocProto, 'hidden', { get: stableGet('document.hidden',false) });
    }
    // hasFocus
    const hasFocusImpl = freezeFn(function hasFocus() {
      if (CONFIG.notify.hasFocusCall) notify('document.hasFocus() call');
      return true;
    });
    define(DocProto, 'hasFocus', { value: hasFocusImpl }) || define(document, 'hasFocus', { value: hasFocusImpl });
    try { if (!document.__origHasFocus) Object.defineProperty(document, '__origHasFocus', { value: DocProto.hasFocus, configurable: true }); } catch {}

    // property-style handlers setters
    const propEvents = ['visibilitychange','webkitvisibilitychange','mozvisibilitychange','msvisibilitychange','focus','blur','focusin','focusout','pageshow','pagehide'];
    const wrapPropSetter = (host, prop) => {
      const key = 'on'+prop;
      const setWrapped = function(v){
        if (typeof v === 'function') {
          const wrapped = function(ev){
            // swallow global blur/focusout from property handlers too
            if (CONFIG.focus?.blockGlobalBlur && (prop === 'blur' || prop === 'focusout') && asGlobalLike(host)) {
              if (CONFIG.notify.invoke[prop]) notify(`${prop} ignored (global blur: prop handler)`);
              return;
            }
            return v.call(this, ev);
          };
          try { Object.defineProperty(v, '__visible_wrap__', { value: wrapped }); } catch {}
          return origSet.call(this, wrapped);
        }
        return origSet.call(this, v);
      };
      const desc = Object.getOwnPropertyDescriptor(host, key) || { configurable:true, enumerable:true };
      const origSet = desc.set || function(fn){ this.addEventListener(prop, fn); };
      define(host, key, { configurable:true, enumerable:desc.enumerable!==false, set:setWrapped, get: desc.get || function(){ return null; } });
    };
    propEvents.forEach(e => { wrapPropSetter(window, e); wrapPropSetter(document, e); });

    if (CONFIG.strictMode) {
      try { harden(Document.prototype,'visibilityState'); harden(Document.prototype,'hidden'); harden(document,'visibilityState'); harden(document,'hidden'); } catch {}
    }
  };

  // listener wrapping + filtering
  const forceVisibilityEvents = () => {
    const TYPES = [
      'visibilitychange','webkitvisibilitychange','mozvisibilitychange','msvisibilitychange',
      'pagehide','freeze','resume','pageshow',
      'blur','focus','focusin','focusout',
      'mouseleave','mouseout','pointerleave','pointerout',
      'mouseover','mouseenter','pointerover',
      'mousemove','pointermove'
    ];
    const EXIT_TYPES  = new Set(['mouseleave','mouseout','pointerleave','pointerout']);
    const ENTER_TYPES = new Set(['mouseover','mouseenter','pointerover']);
    const BLUR_TYPES  = new Set(['blur','focusout']);
    const isEditableTarget = (ev) => {
      if (!ev || !ev.target) return false;
      const t = ev.target;
      if (t.isContentEditable) return true;
      const tag = (t.tagName || '').toLowerCase();
      return tag === 'input' || tag === 'textarea' || tag === 'select';
    };

    let allowOneGlobalEnter = !!CONFIG.mouse.initialEnterOnce;

    const ensureVisibleDescriptors = () => {
      try {
        Object.defineProperty(document, 'visibilityState', { get: () => 'visible', configurable: true });
        Object.defineProperty(document, 'hidden', { get: () => false, configurable: true });
      } catch {}
    };

    const wrapHandler = (type, fn, ctx) => {
      const wrapped = function(event) {
        ensureVisibleDescriptors();
        // swallow global blur/focusout
        if (CONFIG.focus?.blockGlobalBlur && BLUR_TYPES.has(type) && asGlobalLike(ctx)) {
          if (CONFIG.notify.invoke[type]) notify(`${type} ignored (global blur)`);
          return; // don't call site handler
        }
        // swallow global exit
        if (CONFIG.mouse.ignoreGlobalLeave && EXIT_TYPES.has(type) && asGlobalLike(ctx) && (!event || event.relatedTarget == null)) {
          STATS.invokeSwallowed[type] = (STATS.invokeSwallowed[type]||0)+1;
          if (CONFIG.notify.invoke[type]) notify(`${type} ignored (global exit)`);
          return;
        }
        // swallow global enter
        if (CONFIG.mouse.blockGlobalEnter && ENTER_TYPES.has(type) && asGlobalLike(ctx) && (!event || event.relatedTarget == null)) {
          if (allowOneGlobalEnter) {
            allowOneGlobalEnter = false;
          } else {
            STATS.invokeSwallowed[type] = (STATS.invokeSwallowed[type]||0)+1;
            if (CONFIG.notify.invoke[type]) notify(`${type} ignored (global enter)`);
            return;
          }
        }
        // strict: also treat body/html/visualViewport as global always
        if (CONFIG.strictMode && (EXIT_TYPES.has(type) || ENTER_TYPES.has(type)) && (ctx===document.body || ctx===document.documentElement || ctx===window.visualViewport)) {
          STATS.invokeSwallowed[type] = (STATS.invokeSwallowed[type]||0)+1;
          if (CONFIG.notify.invoke[type]) notify(`${type} ignored (strict global ${type})`);
          return;
        }
        if (CONFIG.notify.invoke[type]) {
          if (!(CONFIG.suppressFocusOnEditable && (type === 'focus' || type === 'blur' || type==='focusin' || type==='focusout') && isEditableTarget(event))) {
            notify(`${type} listener invoked`);
          }
        }
        try { return fn.call(this, event); } catch(e) { setTimeout(() => { throw e; }); }
      };
      return freezeFn(wrapped);
    };

    const TYPE_SET = new Set(TYPES);
    const makeWrapped = (t, listener, ctx) => {
      // normalize to a callable
      let fn = listener;
      if (typeof listener === 'object' && typeof listener.handleEvent === 'function') {
        fn = function(ev){ return listener.handleEvent.call(listener, ev); };
      }
      if (typeof fn !== 'function') return null;
      const wrapped = wrapHandler(t, fn, ctx);
      try { Object.defineProperty(listener, '__visible_wrap__', { value: wrapped }); } catch {}
      return wrapped;
    };
    const patchAEL = (proto, label) => {
      const orig = proto.addEventListener;
      define(proto, 'addEventListener', {
        value: function(type, listener, options) {
          const t = String(type);
          if (!listener || !TYPE_SET.has(t)) return orig.call(this, type, listener, options);

          // block registration of global blur/focusout listeners
          if (CONFIG.focus?.blockGlobalBlur && BLUR_TYPES.has(t) && asGlobalLike(this)) {
            STATS.addBlocked[t] = (STATS.addBlocked[t]||0)+1;
            if (CONFIG.notify.addListener[t]) notify(`${label}.addEventListener("${t}") blocked on global target`);
            return;
          }

          // block registration of exit/enter listeners on global-ish targets
          if ((CONFIG.mouse.spoofExit && EXIT_TYPES.has(t) && asGlobalLike(this)) ||
              (CONFIG.mouse.blockGlobalEnter && ENTER_TYPES.has(t) && asGlobalLike(this)) ||
              (CONFIG.strictMode && (EXIT_TYPES.has(t) || ENTER_TYPES.has(t)) &&
                (this===document.body || this===document.documentElement || this===window.visualViewport))) {
            STATS.addBlocked[t] = (STATS.addBlocked[t]||0)+1;
            if (CONFIG.notify.addListener[t]) notify(`${label}.addEventListener("${t}") blocked on global target`);
            return;
          }

          if (CONFIG.notify.addListener[t]) notify(`${label}.addEventListener("${t}")`);

          const wrapped = makeWrapped(t, listener, this);
          // if it's not a function or EventListener object, just pass through
          return orig.call(this, type, wrapped || listener, options);
        }
      });

      const origRel = proto.removeEventListener;
      define(proto, 'removeEventListener', {
        value: function(type, listener, options) {
          const l = listener && listener.__visible_wrap__ ? listener.__visible_wrap__ : listener;
          return origRel.call(this, type, l, options);
        }
      });

      if (CONFIG.strictMode) { try { harden(proto,'addEventListener'); harden(proto,'removeEventListener'); } catch {} }
    };

    patchAEL(EventTarget.prototype, 'EventTarget');
  };

  // timers normalization (lightweight)
  const installTimerShims = () => {
    if (!CONFIG.patchTimers) return;
    try {
      const _raf = window.requestAnimationFrame.bind(window);
      const _caf = window.cancelAnimationFrame ? window.cancelAnimationFrame.bind(window) : ()=>{};
      let lastRaf = 0;
      const rafWrapped = freezeFn(function(cb){
        const start = performance.now();
        return _raf(function(t){
          const dt = t - lastRaf;
          lastRaf = t;
          // if raf is obviously throttled, simulate a smoother cadence
          if (dt > 80) {
            setTimeout(()=>cb(performance.now()), 16);
          } else {
            cb(t);
          }
        });
      });
      define(window, 'requestAnimationFrame', { value: rafWrapped });
      define(window, 'cancelAnimationFrame', { value: freezeFn(_caf) });

      const _ric = window.requestIdleCallback && window.requestIdleCallback.bind(window);
      if (_ric) {
        const ricWrapped = freezeFn(function(cb, opts){
          return _ric(function(deadline){
            if (!deadline || typeof deadline.timeRemaining !== 'function') {
              try { cb({ didTimeout:false, timeRemaining:()=>10 }); } catch {}
              return;
            }
            if (deadline.timeRemaining() < 5) {
              try { cb({ didTimeout:false, timeRemaining:()=>10 }); } catch {}
            } else {
              try { cb(deadline); } catch {}
            }
          }, opts);
        });
        define(window, 'requestIdleCallback', { value: ricWrapped });
      }
    } catch {}
  };

  // pointer capture softeners
  const installPointerCaptureShims = () => {
    if (!CONFIG.patchPointerCapture || !Element || !Element.prototype) return;
    try {
      const EP = Element.prototype;
      const _spc = EP.setPointerCapture;
      const _rpc = EP.releasePointerCapture;
      if (_spc) define(EP, 'setPointerCapture', { value: freezeFn(function(pointerId){
        try {
          const g = this === document.documentElement || this === document.body;
          if (g) return; // no-op on global-ish targets
        } catch {}
        return _spc.apply(this, arguments);
      })});
      if (_rpc) define(EP, 'releasePointerCapture', { value: freezeFn(function(pointerId){
        try { return _rpc.apply(this, arguments); } catch {}
      })});
      if (CONFIG.strictMode) { try { harden(EP, 'setPointerCapture'); harden(EP,'releasePointerCapture'); } catch {} }
    } catch {}
  };

  // synthetic mouse/pointer presence
  const installFakeMouse = () => {
    if (!CONFIG.mouse.fakeMovement) return;
    let lastX = Math.max(10, Math.min(window.innerWidth - 10, Math.floor(window.innerWidth / 2)));
    let lastY = Math.max(10, Math.min(window.innerHeight - 10, Math.floor(window.innerHeight / 2)));
    const update = (e) => {
      if (!e) return;
      if (typeof e.clientX === 'number') lastX = e.clientX;
      if (typeof e.clientY === 'number') lastY = e.clientY;
    };
    window.addEventListener('mousemove', update, { passive: true, capture: true });
    const base = Math.max(4000, CONFIG.mouse.fakeIntervalMs | 0);
    const nextDelay = () => {
      if (!CONFIG.mouse.randomizeInterval) return base;
      const jitter = base * 0.3;
      return Math.max(2000, base + (Math.random()*2*jitter - jitter));
    };
    const tick = () => {
      try {
        const jx = (Math.random()*CONFIG.mouse.moveJitterPx*2 - CONFIG.mouse.moveJitterPx)|0;
        const jy = (Math.random()*CONFIG.mouse.moveJitterPx*2 - CONFIG.mouse.moveJitterPx)|0;
        const x = Math.max(0, Math.min(window.innerWidth - 1, lastX + jx));
        const y = Math.max(0, Math.min(window.innerHeight - 1, lastY + jy));
        const mouseEv = new MouseEvent('mousemove', { bubbles:true, cancelable:false, clientX:x, clientY:y, screenX:x, screenY:y, view:window });
        document.dispatchEvent(mouseEv);
        STATS.synthetic.mousemove = (STATS.synthetic.mousemove||0)+1;
        if (CONFIG.notify.invoke.mousemove) notify('synthetic mousemove dispatched');
        if (CONFIG.mouse.alsoPointerMove && 'PointerEvent' in window) {
          const ptr = new PointerEvent('pointermove', { bubbles:true, cancelable:false, clientX:x, clientY:y, pointerType:'mouse', isPrimary:true, view:window });
          document.dispatchEvent(ptr);
          STATS.synthetic.pointermove = (STATS.synthetic.pointermove||0)+1;
        }
        if (CONFIG.mouse.lightScrollNudge && document.scrollingElement && (document.scrollingElement.scrollHeight > document.scrollingElement.clientHeight)) {
          const se = document.scrollingElement;
          const start = se.scrollTop;
          se.scrollTop = start + 0.5;
          se.scrollTop = start;
          STATS.synthetic.scroll = (STATS.synthetic.scroll||0)+1;
        }
      } catch {}
      setTimeout(tick, nextDelay());
    };
    setTimeout(tick, nextDelay());
  };

  // one-time visibility ping
  const dispatchInitialPing = () => {
    try { document.dispatchEvent(new Event('visibilitychange')); } catch {}
    try { document.dispatchEvent(new Event('pageshow')); } catch {}
  };

  // focus/blur interceptors on window
  const installWindowFocusShims = () => {
    try {
      const no = freezeFn(function(){ /* no-op */ });
      define(window, 'focus', { value: no });
      define(window, 'blur', { value: no });
      if (CONFIG.strictMode) { harden(window,'focus'); harden(window,'blur'); }
    } catch {}
  };

  // reapply guards
  const installReapplyGuards = () => {
    const reapply = () => {
      try {
        if (document.visibilityState !== 'visible' || document.hidden !== false) forceVisibilityProps();
      } catch {}
    };
    const mo = new MutationObserver(reapply);
    try { mo.observe(document.documentElement, { childList: true, subtree: true }); } catch {}
    if (CONFIG.paranoidMode) {
      setInterval(() => {
        try {
          forceVisibilityProps();
        } catch {}
      }, 1500);
    }
  };

  // page-realm patch (mirrors key pieces) — respects config and doesn't swallow focusout
  const injectPageRealm = () => {
    if (!CONFIG.pageRealmPatch) return;
    const src = `
      (function(){
        try{
          const BLOCK_GLOBAL_BLUR  = ${JSON.stringify(!!(CONFIG.focus && CONFIG.focus.blockGlobalBlur))};
          const BLOCK_GLOBAL_EXIT  = ${JSON.stringify(!!(CONFIG.mouse && CONFIG.mouse.ignoreGlobalLeave))};
          const BLOCK_GLOBAL_ENTER = ${JSON.stringify(!!(CONFIG.mouse && CONFIG.mouse.blockGlobalEnter))};
          const ALLOW_ONE_ENTER    = ${JSON.stringify(!!(CONFIG.mouse && CONFIG.mouse.initialEnterOnce))};
          let allowOneGlobalEnter = ALLOW_ONE_ENTER;

          const define = ${define.toString()};
          const freezeFn = ${freezeFn.toString()};
          const asGlobalLike = ${asGlobalLike.toString()};
          const stableGet=(name,val)=>function(){return val;};

          const DocProto=Document.prototype;
          define(DocProto,'visibilityState',{get:stableGet('document.visibilityState','visible')})||define(document,'visibilityState',{get:stableGet('document.visibilityState','visible')});
          define(DocProto,'hidden',{get:stableGet('document.hidden',false)})||define(document,'hidden',{get:stableGet('document.hidden',false)});
          [['webkitVisibilityState','visible'],['mozVisibilityState','visible'],['msVisibilityState','visible'],
           ['webkitHidden',false],['mozHidden',false],['msHidden',false]].forEach(([k,v])=>{
            define(DocProto,k,{get:stableGet('document.'+k,v)})||define(document,k,{get:stableGet('document.'+k,v)});
          });
          const hasFocusImpl = freezeFn(function hasFocus(){return true;});
          define(DocProto,'hasFocus',{value:hasFocusImpl})||define(document,'hasFocus',{value:hasFocusImpl});

          const TYPES=['visibilitychange','webkitvisibilitychange','mozvisibilitychange','msvisibilitychange','pagehide','freeze','resume','pageshow',
                       'blur','focus','focusin','focusout',
                       'mouseleave','mouseout','pointerleave','pointerout',
                       'mouseover','mouseenter','pointerover',
                       'mousemove','pointermove'];

          const EXIT_TYPES  = new Set(['mouseleave','mouseout','pointerleave','pointerout']);
          const ENTER_TYPES = new Set(['mouseover','mouseenter','pointerover']);
          const BLUR_TYPES  = new Set(['blur']); // key fix: don't treat focusout as a global blur

          const ensureVisible=()=>{try{
            Object.defineProperty(document,'visibilityState',{get:()=> 'visible',configurable:true});
            Object.defineProperty(document,'hidden',{get:()=> false,configurable:true});
          }catch(e){}};

          const wrapHandler=(type,fn,ctx)=>freezeFn(function(event){
            ensureVisible();
            if (BLOCK_GLOBAL_BLUR && BLUR_TYPES.has(type) && asGlobalLike(ctx)) return;
            if (BLOCK_GLOBAL_EXIT && EXIT_TYPES.has(type) && asGlobalLike(ctx) && (!event || event.relatedTarget==null)) return;
            if (BLOCK_GLOBAL_ENTER && ENTER_TYPES.has(type) && asGlobalLike(ctx) && (!event || event.relatedTarget==null)) {
              if (allowOneGlobalEnter) { allowOneGlobalEnter=false; } else { return; }
            }
            try { return fn.call(this,event); } catch(e){ setTimeout(()=>{ throw e; }); }
          });

          const patchAEL=(proto)=>{
            const orig=proto.addEventListener;
            define(proto,'addEventListener',{value:function(type,listener,options){
              const t=String(type);
              if (!listener || TYPES.indexOf(t)===-1) return orig.call(this,type,listener,options);

              if (BLOCK_GLOBAL_BLUR && BLUR_TYPES.has(t) && asGlobalLike(this)) return;
              if (((EXIT_TYPES.has(t) && BLOCK_GLOBAL_EXIT) || (ENTER_TYPES.has(t) && BLOCK_GLOBAL_ENTER)) && asGlobalLike(this)) return;

              let fn=listener;
              if (typeof listener==='object' && typeof listener.handleEvent==='function'){
                fn=function(ev){ return listener.handleEvent.call(listener,ev); };
              }
              if (typeof fn!=='function') return orig.call(this,type,listener,options);

              const wrapped=wrapHandler(t,fn,this);
              try { Object.defineProperty(listener,'__visible_wrap__',{value:wrapped}); } catch {}
              return orig.call(this,type,wrapped,options);
            }});

            const origRel=proto.removeEventListener;
            define(proto,'removeEventListener',{value:function(type,listener,options){
              const l=listener && listener.__visible_wrap__ ? listener.__visible_wrap__ : listener;
              return origRel.call(this,type,l,options);
            }});
          };

          patchAEL(EventTarget.prototype);
          try{ document.dispatchEvent(new Event('visibilitychange')); }catch(e){}
          try{ document.dispatchEvent(new Event('pageshow')); }catch(e){}
        }catch(e){}
      })();
    `;
    const blob = new Blob([src], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const s = document.createElement('script');
    s.src = url;
    (document.head || document.documentElement).appendChild(s);
    s.onload = () => { try{ s.remove(); URL.revokeObjectURL(url); }catch{} };
  };

  // control api (randomized key + randomized method names)
  // note: prints the mapping to the console once so you can find it.
  // if you want zero console noise, delete the console.info line.
  const exposeApi = () => {
    if (!CONFIG.exposeApi) return;

    // build logical methods first
    const logical = {
      setStrict(v){ CONFIG.strictMode = !!v; },
      setParanoid(v){ CONFIG.paranoidMode = !!v; },
      setNotify(k,v){ if (k in CONFIG.notify) CONFIG.notify[k] = v; },
      setMouse(k,v){ if (k in CONFIG.mouse) CONFIG.mouse[k] = v; },
      stats(){ return JSON.parse(JSON.stringify(STATS)); },
      reapply(){ return forceVisibilityProps(); }
    };

    // create the randomized API object
    const api = {};
    const nameMap = {}; // logicalName -> randomizedName for convenience

    for (const [logicalName, fn] of Object.entries(logical)) {
      const randName = secureRandomString(12);
      nameMap[logicalName] = randName;
      Object.defineProperty(api, randName, {
        value: freezeFn(fn),
        configurable: false,
        enumerable: false,   // hide from for..in/Object.keys
        writable: false
      });
    }

    // random API handle on window each load
    const apiKey = '__' + secureRandomString(14);
    Object.defineProperty(window, apiKey, {
      value: api,
      configurable: false,
      enumerable: false,
      writable: false
    });

    // tells you how to call it each load
    try { console.info('[AVC] api key:', `window.${apiKey}`, 'methods:', nameMap); } catch {}
  };

  // apply
  forceVisibilityProps();
  forceVisibilityEvents();
  installWindowFocusShims();
  installPointerCaptureShims();
  installTimerShims();
  installFakeMouse();
  exposeApi();
  injectPageRealm();
  document.addEventListener('DOMContentLoaded', dispatchInitialPing, { once: true });
  installReapplyGuards();
})();
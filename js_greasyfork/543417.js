// ==UserScript==
// @name         Linksys Router Infinite Waiting Fix
// @description  Fixes infinite 'Waiting' splash screen on older Linksys models
// @version      1.1
// @match        http://192.168.*/*
// @match        http://192.168.1.1/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @namespace    linksys-sux.bonetrail.net
// @downloadURL https://update.greasyfork.org/scripts/543417/Linksys%20Router%20Infinite%20Waiting%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/543417/Linksys%20Router%20Infinite%20Waiting%20Fix.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const state = {
    faked: false,
    bootStarted: false,
    good: { devices: null, conns: null },
  };

  const TAG  = '[RAINIER-PATCH]';
  const log  = (...a) => console.log(TAG, ...a);
  const warn = (...a) => console.warn(TAG, ...a);

  const DM_FLAG = Symbol('dmPatched');
  const TX_FLAG = Symbol('txPatched');
  const FN_FLAG = Symbol('fnPatched');

  // --- Caches of good data we can reuse when the new endpoints fail ---
  const cache = {
    devices: null,          // from ANY successful devicelist call
    connections: null       // from ANY successful networkconnections call
  };
  window.__RAINIER_CACHE = cache; // expose to second IIFE

  // Utility -------------------------------------------------------------

  function normalizeGetDevicesArgs(args) {
    if (typeof args[0] === 'object' && args[0] !== null) return args[0];
    return {
      cb: args[0],
      exclusions: args[1],
      threshold: args[2],
      cbError: args[3],
      doPollForChange: args[4],
      currentRevision: args[5],
    };
  }

  function wrapMethod(obj, name, wrapper) {
    const orig = obj[name];
    if (typeof orig !== 'function' || orig[FN_FLAG]) return;
    const patched = wrapper(orig);
    patched[FN_FLAG] = true;
    obj[name] = patched;
  }

  function safe(fn) {
    try { return fn(); } catch (_) {}
  }

  // Predicate helpers for action URLs ----------------------------------

  function isDevicesAction(a) {
    return /\/jnap\/devicelist\/GetDevices/i.test(a);
  }

  function isDevices3Action(a) {
    return /\/jnap\/devicelist\/GetDevices3/i.test(a);
  }

  function isNetConnsAction(a) {
    return /\/jnap\/networkconnections\/GetNetworkConnections/i.test(a);
  }

  function isNetConns2Action(a) {
    return /\/jnap\/networkconnections\/GetNetworkConnections2/i.test(a);
  }

  // Builders for fake responses ----------------------------------------

  function buildDevicesFallback() {
    if (cache.devices) {
      // Clone minimally
      return {
        result: 'OK',
        output: {
          revision: cache.devices.output?.revision ?? Date.now(),
          devices: cache.devices.output?.devices ?? [],
          deletedDeviceIDs: cache.devices.output?.deletedDeviceIDs ?? []
        }
      };
    }
    return {
      result: 'OK',
      output: {
        revision: Date.now(),
        devices: [],
        deletedDeviceIDs: []
      }
    };
  }

  function buildNetConnsFallback() {
    if (cache.connections) {
      return {
        result: 'OK',
        output: {
          connections: cache.connections.output?.connections ?? []
        }
      };
    }
    return {
      result: 'OK',
      output: { connections: [] }
    };
  }

  // DeviceManager patch -------------------------------------------------

  function patchDeviceManager(dm) {
    if (!dm || dm[DM_FLAG]) return;

    wrapMethod(dm, 'getDevices', (orig) => function patchedGetDevices() {
      const opts = normalizeGetDevicesArgs(arguments);
      const userCb     = typeof opts.cb === 'function' ? opts.cb : () => {};
      const userCbError = typeof opts.cbError === 'function' ? opts.cbError : null;
      const timeoutMs   = (opts.threshold || 30000) + 5000;

      let finished = false;
      function done(list) {
        if (finished) return;
        finished = true;
        try { userCb(list || []); } catch (e) { warn('user cb blew up', e); }
      }
      function fail(err) {
        warn('getDevices failed/hung, faking empty list', err);
        if (userCbError) safe(() => userCbError(err));
        safe(() => RAINIER?.event?.fire?.('devices.revisionUpdated'));
        done([]);
      }

      const timer = setTimeout(() => fail(new Error('timeout')), timeoutMs);

      const patchedOpts = { ...opts };
      patchedOpts.cb = (list) => { clearTimeout(timer); done(list); };
      patchedOpts.cbError = (err) => { clearTimeout(timer); fail(err || new Error('unknown error')); };

      try {
        return orig.call(this, patchedOpts);
      } catch (e) {
        clearTimeout(timer);
        fail(e);
      }
    });

    dm[DM_FLAG] = true;
    log('deviceManager patched');
  }

  // JNAP Transaction patch ---------------------------------------------

  function patchJnap(jnap) {
    if (!jnap || jnap[TX_FLAG]) return;

    const OrigTx = jnap.Transaction;
    if (typeof OrigTx !== 'function') return;

    jnap.Transaction = function patchedTransaction(opts) {
      const tx = OrigTx.call(this, opts);
      if (!tx || tx[TX_FLAG]) return tx;
      tx[TX_FLAG] = true;

      // Wrap per-request cb
      wrapMethod(tx, 'add', (origAdd) => function (req) {
        try {
          if (req && typeof req.cb === 'function') {
            const action = req.action;
            const origCb = req.cb;

            req.cb = function (resp) {
              // Save good data to cache
              if (resp && resp.result === 'OK') {
                if (isDevicesAction(action))       cache.devices    = resp;
                if (isNetConnsAction(action))      cache.connections = resp;
              }

              // Fix bad responses
              if (!resp || resp.result !== 'OK') {
                if (isDevices3Action(action)) {
                  warn('JNAP tx cb intercepted, faking OK for', action, resp);
                  resp = buildDevicesFallback();
                } else if (isNetConns2Action(action)) {
                  warn('JNAP tx cb intercepted, faking OK for', action, resp);
                  resp = buildNetConnsFallback();
                }
              }

              try { origCb(resp); } catch (e) { warn('req.cb threw', e); }
            };
          }
        } catch (e) {
          warn('tx.add wrap error', e);
        }
        return origAdd.call(this, req);
      });

      // Ensure onComplete always has OK
      if (opts && typeof opts.onComplete === 'function') {
        const origOnComplete = opts.onComplete;
        opts.onComplete = function (T) {
          if (!T || T.result !== 'OK') {
            warn('onComplete intercepted, forcing OK', T);
            T = { result: 'OK' };
          }
          try { origOnComplete(T); } catch (e) { warn('onComplete threw', e); }
        };
      }

      return tx;
    };

    jnap[TX_FLAG] = true;
    log('RAINIER.jnap.Transaction patched');
  }

  // Watchdog loop -------------------------------------------------------

  const seenDMs = new WeakSet();

  function tick() {
    const R = window.RAINIER;
    if (!R) return;

    patchJnap(R.jnap);

    const dm = R.deviceManager;
    if (dm && !seenDMs.has(dm)) {
      seenDMs.add(dm);
      patchDeviceManager(dm);
    }
  }

  let n = 0;
  const fast = setInterval(() => {
    n++;
    tick();
    if (n > 400) {
      clearInterval(fast);
      setInterval(tick, 1000);
    }
  }, 25);

  document.addEventListener('DOMContentLoaded', tick, { once: true });

})();


/* ---------------------------------------------------------------------
 *  Low-level XHR patch: cache short-circuit + in-flight de-dupe
 * -------------------------------------------------------------------*/
(function () {
  console.log('[RAINIER-PATCH] swapped out XMLHTTPReqeuest');

  // Use the same cache as the first IIFE
  const cache = window.__RAINIER_CACHE || { devices: null, connections: null };
  const good  = { devices: null, conns: null }; // keep for backwards compat in this block
  const lastRev = { devices: -1, conns: -1 };
  const inflight = new Map(); // bodyString -> [xhr1, xhr2, ...]

  const origOpen = XMLHttpRequest.prototype.open;
  const origSend = XMLHttpRequest.prototype.send;

  window.__RAINIER_FIX = {
    hasRanUIFix: false,
    fixUI: () => {
      console.log('[RAINIER-PATCH] Inited UI manually');
      // pulls in items for menu
      window.RAINIER.connect.AppletManager.initialize(() => _)
      // hides loading spinner, only after request is done
      window.RAINIER.ui.init()
      // builds menu items
      window.RAINIER.ui.MainMenu.initialize()
      // loads in dashboard widgets
      window.RAINIER.connect.widgetManager.setupWidgets()
      // gets top menu kinda working
      window.RAINIER.ui.TopMenu.initialize()
    }
  };

  const CACHEABLE = /GetDevices(?:\d+)?$|GetNetworkConnections(?:\d+)?$/i;

  function cacheKeyForAction(action) {
    if (/GetDevices/i.test(action)) return 'devices';
    if (/GetNetworkConnections/i.test(action)) return 'connections';
    return null;
  }

  function getSinceRev(req) {
    return (req && req.request && typeof req.request.sinceRevision === 'number')
      ? req.request.sinceRevision
      : 0;
  }

  function respondFromCache(xhr, payload) {
    setTimeout(() => {
      try {
        overwriteResponse(xhr, payload);
        if (xhr.readyState !== 4) {
          try { Object.defineProperty(xhr, 'readyState', { value: 4 }); } catch {}
          xhr.dispatchEvent(new Event('readystatechange'));
        }
        xhr.dispatchEvent(new Event('load'));
        xhr.dispatchEvent(new Event('loadend'));
        console.log('[RAINIER-PATCH] Served JNAP batch from cache');
      } catch (e) {
        console.warn('[RAINIER-PATCH] respondFromCache failed', e);
      }
    }, 0);
  }

  XMLHttpRequest.prototype.open = function (m, url) {
    this.__isJnap = /\/jnap\//i.test(url);
    this.__url    = url;
    return origOpen.apply(this, arguments);
  };

  XMLHttpRequest.prototype.send = function (body) {
    if (!this.__isJnap) return origSend.apply(this, arguments);

    // Try to parse outgoing batch
    let batch;
    try { batch = JSON.parse(body); } catch {}

    const isBatch = Array.isArray(batch) && batch.every(o => o && o.action);

    if (isBatch) {
      // 1) Try to satisfy entirely from cache
      const allCacheable = batch.every(req => CACHEABLE.test(req.action));
      if (allCacheable) {
        const canServeAll = batch.every(req => {
          const key = cacheKeyForAction(req.action);
          if (!key) return false;
          const cached = cache[key];
          if (!cached) return false;
          const sr = getSinceRev(req);
          const cachedRev = cached.output?.revision ?? lastRev[key] ?? -1;
          return typeof cachedRev === 'number' && cachedRev >= sr;
        });

        if (canServeAll) {
          const responses = batch.map(req => {
            const key = cacheKeyForAction(req.action);
            return cache[key];
          });
          return respondFromCache(this, { result: 'OK', responses });
        }
      }

      // 2) Rewrite sinceRevision=0 to our last known revision to avoid heavy dumps
      let modified = false;
      for (const req of batch) {
        const key = cacheKeyForAction(req.action);
        if (!key) continue;
        const cached = cache[key];
        const cachedRev = cached?.output?.revision ?? lastRev[key];
        if (!req.request) req.request = {};
        if (typeof req.request.sinceRevision !== 'number') req.request.sinceRevision = 0;

        if (req.request.sinceRevision === 0 && typeof cachedRev === 'number' && cachedRev > 0) {
          req.request.sinceRevision = cachedRev;
          modified = true;
        }
      }
      if (modified) {
        body = JSON.stringify(batch);
      }

      // 3) In-flight de-dupe
      const bodyKey = body;
      if (inflight.has(bodyKey)) {
        inflight.get(bodyKey).push(this);
        this.__piggyback__ = true;
      } else {
        inflight.set(bodyKey, [this]);
      }
    }

    this.addEventListener('load', function () {
      // Only the "leader" will run this block (piggybackers will be replayed)
      try {
        const raw = this.responseText;
        let data;
        try { data = JSON.parse(raw); } catch (e) { return; }

        // JNAP batch => {result, responses:[...]}
        if (data && data.result === 'OK' && Array.isArray(data.responses) && isBatch) {
          data.responses.forEach((r, i) => {
            const action = batch[i]?.action || '';
            if (r.result === 'OK') {
              if (/GetDevices$/i.test(action)) {
                good.devices = r;
                cache.devices = r;
                if (typeof r.output?.revision === 'number') lastRev.devices = r.output.revision;
              }
              if (/GetNetworkConnections$/i.test(action)) {
                good.conns = r;
                cache.connections = r;
                // no explicit revision in connections response usually
              }
            } else {
              if (/GetDevices3$/i.test(action))              data.responses[i] = good.devices || fakeDevices();
              if (/GetNetworkConnections2$/i.test(action))   data.responses[i] = good.conns   || fakeConns();
            }
          });

          // If we mutated the payload, overwrite
          if (JSON.stringify(data) !== raw) {
            console.log('[RAINIER-PATCH] Overwrote broken request. Old:', raw, 'New:', data);
            overwriteResponse(this, data);
            if (!window.__RAINIER_FIX.hasRanUIFix) {
              window.__RAINIER_FIX.hasRanUIFix = true;
              // give a sec for their garbage to figure itself out
              setTimeout(window.__RAINIER_FIX.fixUI, 1000);
            }
          }
        }
      } catch (e) {
        console.warn('[XHR-PATCH] parse/patch failed', e);
      } finally {
        // Release piggybackers
        if (isBatch) {
          const bodyKey = typeof body === 'string' ? body : JSON.stringify(batch);
          const waiters = inflight.get(bodyKey) || [];
          inflight.delete(bodyKey);
          if (waiters.length > 1) {
            for (const x of waiters) {
              if (x === this) continue; // leader already handled
              try {
                overwriteResponse(x, JSON.parse(this.responseText));
                if (x.readyState !== 4) {
                  Object.defineProperty(x, 'readyState', { value: 4 });
                  x.dispatchEvent(new Event('readystatechange'));
                }
                x.dispatchEvent(new Event('load'));
                x.dispatchEvent(new Event('loadend'));
              } catch (e) { console.warn('piggyback replay failed', e); }
            }
          }
        }
      }
    });

    return origSend.apply(this, arguments);
  };

  function overwriteResponse(xhr, obj) {
    const text = JSON.stringify(obj);
    Object.defineProperty(xhr, 'responseText', { value: text });
    Object.defineProperty(xhr, 'response',     { value: text });
  }

  function fakeDevices() {
    return { result: 'OK', output: { revision: Date.now(), devices: [], deletedDeviceIDs: [] } };
  }
  function fakeConns() {
    return { result: 'OK', output: { connections: [] } };
  }
})();


// RAINIER disconnect warning dialog shim (robust UI detection + fallback)
setTimeout(function () {
  var $ = window.jQuery || window.$;
  if (!$ || window.__disconnectWarningPatchedV2) return;
  window.__disconnectWarningPatchedV2 = true;

  // Namespaces
  window.RAINIER = window.RAINIER || {};
  var C = (RAINIER.connect = RAINIER.connect || {});

  // Overlay container
  var $overlay = $('#disconnect-warning-overlay');
  if (!$overlay.length) {
    $overlay = $('<div id="disconnect-warning-overlay" style="display:none;"></div>').appendTo('body');
  }

  // Root dialog scaffold (only once)
  var $root = $('#disconnect-warning-root');
  if (!$root.length) {
    $root = $(
      '<div id="disconnect-warning-root" role="dialog" aria-modal="true" aria-labelledby="disconnect-warning-title" style="display:none;">' +
        '<div class="dw-header"><h3 id="disconnect-warning-title">Wireless Settings Update</h3></div>' +
        '<div id="disconnect-warning-wireless"></div>' +

        // text buckets that s(...) toggles
        '<div id="disconnect-warning-default-text" class="warning-text wireless-hide-text" style="display:none;"></div>' +
        '<div id="disconnect-warning-wireless-networks-disabled-text" class="warning-text wireless-hide-text" style="display:none;"></div>' +
        '<div id="disabling-24-50ghz-wireless-scheduler-enabled-text" class="warning-text wireless-hide-text" style="display:none;"></div>' +
        '<div id="disabling-24-50_1ghz-disables-guest-access-text" class="warning-text wireless-hide-text" style="display:none;"></div>' +
        '<div id="disabling-24-50ghz-disables-guest-access-text" class="warning-text wireless-hide-text" style="display:none;"></div>' +
        '<div id="disabling-24ghz-disables-24guest-access-text" class="warning-text wireless-hide-text" style="display:none;"></div>' +
        '<div id="disabling-50_1ghz-disables-50guest-access-text" class="warning-text wireless-hide-text" style="display:none;"></div>' +
        '<div id="disabling-50ghz-disables-50guest-access-text" class="warning-text wireless-hide-text" style="display:none;"></div>' +

        '<div class="dw-actions">' +
          '<button type="button" class="submit">Continue</button>' +
          '<button type="button" class="cancel">Cancel</button>' +
        '</div>' +
      '</div>'
    ).appendTo($overlay);
  }

  // Minimal styles (once)
  if (!$('#disconnect-warning-styles').length) {
    $('<style id="disconnect-warning-styles">' +
      '#disconnect-warning-overlay{position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:9999;display:none;}' +
      '#disconnect-warning-root{max-width:560px;margin:10vh auto;background:#fff;border-radius:8px;padding:16px;box-shadow:0 10px 30px rgba(0,0,0,.2);}' +
      '#disconnect-warning-root .dw-actions{display:flex;gap:8px;justify-content:flex-end;margin-top:16px;}' +
      '#disconnect-warning-root .dw-header{margin-bottom:8px;}' +
      '#disconnect-warning-root .submit,#disconnect-warning-root .cancel{padding:6px 12px;border:1px solid #ccc;border-radius:6px;background:#f7f7f7;cursor:pointer;}' +
      '.ui-dialog { position: absolute; width: 100%; z-index: 99999 !important; display: initial !important; }' +
    '</style>').appendTo('head');
  }

  // elDisconnectWarning shim: always returns the dialog root jQuery element
  var originalEl = typeof C.elDisconnectWarning === 'function'
    ? C.elDisconnectWarning.bind(C)
    : null;

  C.elDisconnectWarning = function () {
    try {
      var out = originalEl && originalEl();
      if (out && out.jquery) return out;
    } catch (_) {}
    return $root;
  };

  // Try to initialize *real* jQuery UI dialog; otherwise fall back
  function tryInitJqui($el) {
    if (!$.ui || !$.ui.dialog || typeof $.fn.dialog !== 'function') return null;
    try {
      if (!$el.data('uiDialog') && !$el.data('ui-dialog') && !$el.data('dialog')) {
        $el.dialog({
          modal: true,
          width: 520,
          resizable: false,
          draggable: false,
          autoOpen: false,
          closeOnEscape: true
        });
      }
      return {
        show: function () { $el.dialog('open'); },
        close: function () { $el.dialog('close'); },
        hide: function () { this.close(); },
        isOpen: function () {
          var $w = $el.closest('.ui-dialog');
          return $w.length ? $w.is(':visible') : $el.is(':visible');
        }
      };
    } catch (err) {
      console.warn('jQuery UI dialog failed; using simple modal fallback:', err);
      return null;
    }
  }

  // Simple modal fallback
  var fallback = (function () {
    var open = false;
    function onEsc(e) { if (e.key === 'Escape') api.close(); }
    var api = {
      show: function () {
        open = true;
        $overlay.show();
        $root.show().attr('aria-hidden', 'false');
        $(document).on('keydown.dwEsc', onEsc);
      },
      close: function () {
        open = false;
        $(document).off('keydown.dwEsc', onEsc);
        $root.attr('aria-hidden', 'true').hide();
        $overlay.hide();
      },
      hide: function () { this.close(); },
      isOpen: function () { return open; }
    };
    // Cancel closes
    $root.off('click.dwCancel').on('click.dwCancel', '.cancel', function () {
      C.disconnectWarningDialog.close();
    });
    return api;
  })();

  // Pick UI or fallback
  var api = tryInitJqui($root) || fallback;
  C.disconnectWarningDialog = api;

  // Ensure .submit exists so upstream code can bind/unbind
  if (!$root.find('.submit').length) {
    $root.find('.dw-actions').append('<button type="button" class="submit">Continue</button>');
  }
}, 1000);



// ==UserScript==
// @name         Just Cause 2 Checklist
// @namespace    http://tampermonkey.net/
// @version      2025-08-27-dupfix
// @description  Just Cause
// @author       Walter Woshid
// @match        https://jc2map.info/
// @run-at       document-end
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jc2map.info
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547287/Just%20Cause%202%20Checklist.user.js
// @updateURL https://update.greasyfork.org/scripts/547287/Just%20Cause%202%20Checklist.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const LS_KEYS = {
    COLLECTED: 'jc2_collected_sg_v2' // "sgid@@lat,lng##index"
  };

  // ---------- storage ----------
  function loadJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch { return fallback; }
  }
  function saveJSON(key, obj) {
    try { localStorage.setItem(key, JSON.stringify(obj)); } catch {}
  }
  const collected = loadJSON(LS_KEYS.COLLECTED, {}); // key -> 1

  // Expand old keys (no ##index) to the new ##1 format so old progress still counts
  function migrateCollectedKeysToIndexed() {
    let changed = false;
    for (const oldKey of Object.keys(collected)) {
      if (!/##\d+$/.test(oldKey)) {
        collected[oldKey + '##1'] = 1;
        delete collected[oldKey];
        changed = true;
      }
    }
    if (changed) saveJSON(LS_KEYS.COLLECTED, collected);
  }

  // ---------- state maps ----------
  // sgid and gid are the XML ids, e.g., gid: "Chaos Item", sgid: "Baby Panay Statues"
  const totalsBySg = new Map(); // sgid -> total markers from xml
  const collectedBySg = new Map(); // sgid -> collected count (from storage)
  const gidOfSg = new Map(); // sgid -> gid (derived from DOM buttons)
  const topNameOfGid = new Map(); // gid -> top tab name (e.g., "Chaos Item" -> "Destructables")
  const buttonsBySg = new Map(); // sgid -> <input> button element
  const buttonBaseLabel = new Map(); // sgid -> original label (trimmed)
  const topLinksByName = new Map(); // top tab name -> <a> element
  const topBaseLabel = new Map(); // top tab name -> original text

  function normalizeSpaces(s) { return (s || '').replace(/\s+/g, ' ').trim(); }
  function inc(map, key, d = 1) { map.set(key, (map.get(key) || 0) + d); }
  function setIfMissing(map, key, val) { if (!map.has(key)) map.set(key, val); }

  // ---------- UI scanning ----------
  function scanUI() {
    const container = document.querySelector('#inputUpload');
    if (!container) return false;

    container.querySelectorAll('.tabbertab').forEach(tab => {
      const h2 = tab.querySelector('h2');
      if (!h2) return;
      const topName = normalizeSpaces(h2.textContent);

      // nav link
      const link = Array.from(container.querySelectorAll('.tabbernav a'))
        .find(a => normalizeSpaces(a.textContent) === topName || a.title === topName);
      if (link) {
        topLinksByName.set(topName, link);
        setIfMissing(topBaseLabel, topName, normalizeSpaces(link.textContent));
      }

      // subcategory buttons carry "gid~sgid"
      tab.querySelectorAll('input.input_button[id*="~"]').forEach(btn => {
        const id = btn.id || '';
        const [gidPart, sgPart] = id.split('~');
        if (!gidPart || !sgPart) return;
        const gid = normalizeSpaces(gidPart.replaceAll('_', ' '));
        const sgid = normalizeSpaces(sgPart.replaceAll('_', ' '));

        buttonsBySg.set(sgid, btn);
        gidOfSg.set(sgid, gid);

        const label = normalizeSpaces(btn.value || btn.getAttribute('value') || sgid);
        setIfMissing(buttonBaseLabel, sgid, label);

        topNameOfGid.set(gid, topName);
      });
    });

    return buttonsBySg.size > 0;
  }

  // ---------- totals from XML (exact) ----------
  function buildTotalsFromXml(xmlDoc) {
    try {
      const groups = xmlDoc.getElementsByTagName('g');
      for (let gi = 0; gi < groups.length; gi++) {
        const gEl = groups[gi];
        const gid = gEl.getAttribute('id');
        const sgs = gEl.getElementsByTagName('sg');
        for (let si = 0; si < sgs.length; si++) {
          const sgEl = sgs[si];
          const sgid = sgEl.getAttribute('id');
          const items = sgEl.getElementsByTagName('i');
          totalsBySg.set(sgid, items.length);
          // init collected counter (from storage)
          let c = 0;
          const prefix = sgid + '@@'; // works for both indexed and (migrated) old keys
          for (const key in collected) {
            if (key.startsWith(prefix)) c++;
          }
          collectedBySg.set(sgid, c);
        }
      }
    } catch { /* ignore */ }
  }

  // ---------- UI updates ----------
  function updateSubButton(sgid) {
    const btn = buttonsBySg.get(sgid);
    if (!btn) return;
    const base = buttonBaseLabel.get(sgid) || sgid;
    const total = totalsBySg.get(sgid) || 0;
    const col = Math.min(collectedBySg.get(sgid) || 0, total);
    btn.value = ` ${base} (${col}/${total}) `;
  }

  function ensureTopLinks() {
    const nav = document.querySelector('#inputUpload .tabbernav');
    if (!nav) return false;
    const links = nav.querySelectorAll('a');
    links.forEach(a => {
      const name = normalizeSpaces(a.getAttribute('title') || a.textContent || '');
      if (!name) return;
      if (!topLinksByName.has(name)) {
        topLinksByName.set(name, a);
        if (!topBaseLabel.has(name)) {
          topBaseLabel.set(name, normalizeSpaces(a.textContent || name));
        }
      }
    });
    return topLinksByName.size > 0;
  }

  function updateTopTabByGid(gid) {
    const topName = topNameOfGid.get(gid);
    if (!topName) return;

    let total = 0, col = 0;
    for (const [sgid, g] of gidOfSg.entries()) {
      if (g !== gid) continue;
      total += (totalsBySg.get(sgid) || 0);
      col += (collectedBySg.get(sgid) || 0);
    }

    let link = topLinksByName.get(topName);
    if (!link) {
      ensureTopLinks();
      link = topLinksByName.get(topName) ||
        document.querySelector(`#inputUpload .tabbernav a[title="${topName}"]`);
      if (link && !topBaseLabel.has(topName)) {
        topBaseLabel.set(topName, normalizeSpaces(link.textContent || topName));
      }
    }

    const base = topBaseLabel.get(topName) || topName;
    if (link) link.textContent = `${base} (${col}/${total})`;
  }

  function updateAllUI() {
    for (const sgid of buttonsBySg.keys()) updateSubButton(sgid);
    const gids = new Set(topNameOfGid.keys());
    for (const gid of gids) updateTopTabByGid(gid);
  }

  // ---------- keys for duplicates ----------
  function latlngStr(latlng) {
    const lat = +latlng.lat.toFixed(6);
    const lng = +latlng.lng.toFixed(6);
    return `${lat},${lng}`;
  }
  function keyForIndexed(sgid, latlng, idx) {
    return `${sgid}@@${latlngStr(latlng)}##${idx}`;
  }
  // track how many markers we've assigned at each (sgid,lat,lng) during a build
  const seenIndexBySg = new Map(); // sgid -> Map(latlngStr -> nextIndex)
  function assignIndex(sgid, latlng) {
    let perSg = seenIndexBySg.get(sgid);
    if (!perSg) { perSg = new Map(); seenIndexBySg.set(sgid, perSg); }
    const ll = latlngStr(latlng);
    const next = (perSg.get(ll) || 0) + 1;
    perSg.set(ll, next);
    return next;
  }

  // ---------- marker handling ----------
  function applyCollectedStyle(iconEl, isCollected) {
    iconEl.style.opacity = isCollected ? '0.28' : '';
    iconEl.style.filter = isCollected ? 'grayscale(0.6) contrast(0.9)' : '';
  }

  function getClusterRadiusPx() {
    const oms = unsafeWindow.__oms;
    return (oms && oms.options && oms.options.nearbyDistance) || 8;
  }

  // Count how many other markers are within N pixels of this marker (visible-only)
  function countNearbyMarkers(marker, px = 8) {
    const map = unsafeWindow.map;
    if (!map || !marker || typeof marker.getLatLng !== 'function') return 0;
    const p0 = map.latLngToLayerPoint(marker.getLatLng());
    let n = 0;
    const layers = map._layers || {};
    for (const id in layers) {
      const m = layers[id];
      if (!m || m === marker) continue;
      if (typeof m.getLatLng !== 'function') continue;
      if (!m._icon) continue; // not rendered/visible
      const p = map.latLngToLayerPoint(m.getLatLng());
      const dx = p.x - p0.x, dy = p.y - p0.y;
      if ((dx * dx + dy * dy) <= (px * px)) { n++; if (n > 0) break; }
    }
    return n;
  }

  function attachToggleToMarker(marker, sgid) {
    function registerWithOMS() {
      if (!marker.__jc2OmsAdded && unsafeWindow.__oms && typeof unsafeWindow.__jc2_addToOms === 'function') {
        unsafeWindow.__jc2_addToOms(marker);
        marker.__jc2OmsAdded = true;
      }
    }

    const ensureIcon = () => {
      const el = marker._icon;
      if (!el) return false;
      if (el.dataset.jc2Bound) { registerWithOMS(); return true; }
      el.dataset.jc2Bound = '1';
      el.dataset.jc2Sgid = sgid;

      const ll = marker.getLatLng();
      // assign unique index based on (sgid,lat,lng) for this build
      const idx = assignIndex(sgid, ll);
      const k = keyForIndexed(sgid, ll, idx);
      el.dataset.jc2Key = k;

      const isC = !!collected[k];
      applyCollectedStyle(el, isC);

      // If this point is a cluster, spiderfy on mousedown and skip that click
      el.addEventListener('mousedown', () => {
        const px = getClusterRadiusPx();
        if (countNearbyMarkers(marker, px) > 0) {
          if (unsafeWindow.__oms) unsafeWindow.__oms.spiderfy(marker);
          el.dataset.jc2SkipNextClick = '1';
        }
      }, { passive: true });

      // Toggle only when not skipping and not clustered
      el.addEventListener('click', () => {
        if (el.dataset.jc2SkipNextClick === '1') { el.dataset.jc2SkipNextClick = ''; return; }
        const px = getClusterRadiusPx();
        if (countNearbyMarkers(marker, px) > 0) {
          if (unsafeWindow.__oms) unsafeWindow.__oms.spiderfy(marker);
          return;
        }

        const key = el.dataset.jc2Key;
        const group = el.dataset.jc2Sgid;
        const was = !!collected[key];

        if (was) {
          delete collected[key];
          inc(collectedBySg, group, -1);
        } else {
          collected[key] = 1;
          inc(collectedBySg, group, +1);
        }
        saveJSON(LS_KEYS.COLLECTED, collected);
        applyCollectedStyle(el, !was);
        updateSubButton(group);
        const gid = gidOfSg.get(group);
        if (gid) updateTopTabByGid(gid);
      }, { passive: true });

      registerWithOMS();
      return true;
    };

    if (!ensureIcon()) {
      marker.on('add', () => {
        registerWithOMS();
        ensureIcon();
      });
    }
  }

  // After createMarkers runs, window.markerLayers[sgid] is a LayerGroup.
  function postProcessNewMarkersForSg(sgid) {
    try {
      const lg = unsafeWindow.markerLayers?.[sgid];
      if (!lg || typeof lg.getLayers !== 'function') return;

      // Reset indexer so attachments for this subgroup follow XML order on every build
      seenIndexBySg.set(sgid, new Map());

      const layers = lg.getLayers();
      for (const layer of layers) {
        if (layer && typeof layer.getLatLng === 'function') {
          attachToggleToMarker(layer, sgid);
        }
      }
    } catch { /* noop */ }
  }

  // ---------- bootstrap / monkey-patch ----------
  function start() {
    const okUI = scanUI();
    const xmlDoc = unsafeWindow.xmlDoc;
    const L = unsafeWindow.L;
    if (!okUI || !xmlDoc || !L) {
      requestAnimationFrame(start);
      return;
    }

    ensureTopLinks();

    const mo = new MutationObserver(() => {
      const before = topLinksByName.size;
      const ok = ensureTopLinks();
      if (ok && topLinksByName.size !== before) updateAllUI();
    });
    mo.observe(document.body, { childList: true, subtree: true });

    // Migrate old (non-indexed) keys once
    migrateCollectedKeysToIndexed();

    // Build totals; initialize collectedBySg from storage
    buildTotalsFromXml(xmlDoc);

    // Patch createMarkers to hook new markers as they are created
    const origCreateMarkers = unsafeWindow.createMarkers;
    if (typeof origCreateMarkers === 'function' && !origCreateMarkers.__wrapped) {
      unsafeWindow.createMarkers = function patchedCreateMarkers(xml, itemid) {
        const ret = origCreateMarkers.apply(this, arguments);

        // itemid looks like "Chaos Item~Baby Panay Statues"
        const parts = (itemid || '').split('~');
        const sgid = normalizeSpaces(parts[1] || '');

        if (sgid) postProcessNewMarkersForSg(sgid);

        if (sgid) {
          updateSubButton(sgid);
          const gid = gidOfSg.get(sgid);
          if (gid) updateTopTabByGid(gid);
        } else {
          updateAllUI();
        }
        return ret;
      };
      unsafeWindow.createMarkers.__wrapped = true;
    }

    // First-pass UI
    updateAllUI();

    // Safety net: bind any existing markers
    setTimeout(() => {
      for (const sgid of buttonsBySg.keys()) postProcessNewMarkersForSg(sgid);
      updateAllUI();
    }, 500);
  }

  // Kick off
  start();
})();

// ---- Overzoom without missing tiles ----
(function enableOverzoom() {
  const MAX_Z = 10; // how far you want to zoom in
  const NATIVE_MAX = 5; // highest zoom with real tiles on the site

  function whenReady(fn) {
    if (unsafeWindow.L && unsafeWindow.map && typeof unsafeWindow.map.getZoom === 'function') {
      fn();
    } else {
      setTimeout(() => whenReady(fn), 100);
    }
  }

  whenReady(() => {
    const L = unsafeWindow.L;
    const map = unsafeWindow.map;

    if (typeof map.setMaxZoom === 'function') map.setMaxZoom(MAX_Z);
    map.options.maxZoom = MAX_Z;

    function patchTileLayer(layer) {
      if (!layer || !layer.options) return;
      layer.options.maxZoom = MAX_Z;
      layer.options.maxNativeZoom = NATIVE_MAX;
      if (typeof layer.setMaxZoom === 'function') layer.setMaxZoom(MAX_Z);
      if (typeof layer.setMaxNativeZoom === 'function') layer.setMaxNativeZoom(NATIVE_MAX);
      if (typeof layer.redraw === 'function') layer.redraw();
    }

    Object.values(map._layers || {}).forEach(l => {
      try { if (l instanceof L.TileLayer) patchTileLayer(l); } catch {}
    });

    const origAddLayer = map.addLayer;
    map.addLayer = function wrappedAddLayer(layer) {
      const res = origAddLayer.apply(this, arguments);
      try { if (layer instanceof L.TileLayer) patchTileLayer(layer); } catch {}
      return res;
    };

    if (!L.TileLayer.prototype.__overzoomPatched) {
      const origGet = L.TileLayer.prototype._getZoomForUrl;
      L.TileLayer.prototype._getZoomForUrl = function () {
        const z = origGet ? origGet.call(this) : (this._map ? this._map.getZoom() : NATIVE_MAX);
        const maxNat = (this.options && this.options.maxNativeZoom != null) ? this.options.maxNativeZoom : NATIVE_MAX;
        return (z > maxNat) ? maxNat : z;
      };
      L.TileLayer.prototype.__overzoomPatched = true;
    }

    if (typeof unsafeWindow.zoomFine === 'function') {
      const orig = unsafeWindow.zoomFine;
      unsafeWindow.zoomFine = function (e) {
        return orig.apply(this, arguments);
      };
    }

    map.on('zoomend', () => map.panInsideBounds(map.options.maxBounds || map.getBounds(), { animate: false }));
  });
})();

// --- Overlapping markers: spiderfy on hover ---
(function addSpiderfy() {
  const OMS_URLS = [
    'https://unpkg.com/overlapping-marker-spiderfier-leaflet/dist/oms.min.js',
    'https://cdn.jsdelivr.net/npm/overlapping-marker-spiderfier-leaflet/dist/oms.min.js'
  ];

  function inject(urls, done) {
    if (unsafeWindow.OverlappingMarkerSpiderfier) return done();
    const url = urls.shift();
    if (!url) return console.warn('[OMS] failed to load');
    const s = document.createElement('script');
    s.src = url; s.async = true;
    s.onload = () => done();
    s.onerror = () => inject(urls, done);
    document.head.appendChild(s);
  }

  function initOMS() {
    const map = unsafeWindow.map;
    if (!map || !unsafeWindow.OverlappingMarkerSpiderfier) return;

    const oms = new unsafeWindow.OverlappingMarkerSpiderfier(map, {
      keepSpiderfied: true,
      nearbyDistance: 8,
      circleSpiralSwitchover: 9,
      spiralFootSeparation: 20,
      spiralLengthStart: 11,
      spiralLengthFactor: 5,
      legWeight: 1.2
      // legColors: { usual: '#aaa', highlighted: '#fff' },
    });
    unsafeWindow.__oms = oms;

    let hoverTimer = null;
    function scheduleUnspiderfy() {
      clearTimeout(hoverTimer);
      hoverTimer = setTimeout(() => oms.unspiderfy(), 250);
    }

    unsafeWindow.__jc2_addToOms = function (marker) {
      try {
        oms.addMarker(marker);
        marker.on('mouseover', () => {
          clearTimeout(hoverTimer);
          oms.spiderfy(marker);
        });
        marker.on('mouseout', scheduleUnspiderfy);
      } catch {}
    };

    // Best-effort register already-present markers
    try {
      Object.values(map._layers || {}).forEach(l => {
        if (l && typeof l.getLatLng === 'function') {
          unsafeWindow.__jc2_addToOms(l);
        }
      });
    } catch {}
  }

  (function waitForMap() {
    if (unsafeWindow.L && unsafeWindow.map && typeof unsafeWindow.map.getZoom === 'function') {
      inject(OMS_URLS.slice(), initOMS);
    } else {
      setTimeout(waitForMap, 100);
    }
  })();
})();

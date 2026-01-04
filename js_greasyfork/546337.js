// ==UserScript==
// @name         Wplace dark map theme with color options
// @namespace    Zex2
// @version      2.0
// @description  Makes the wplaces underlay map dark. It's a natural color dark theme with adjustable colors. Default map colors are inspired by the OsmAnd app.
// @match        *://*.wplace.live/*
// @license MIT
// @author       Zex2
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/546337/Wplace%20dark%20map%20theme%20with%20color%20options.user.js
// @updateURL https://update.greasyfork.org/scripts/546337/Wplace%20dark%20map%20theme%20with%20color%20options.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const DEBUG = false;

  const COLORS = {
    land: '#101922',
    water: '#16324f',
    park: '#333927',
    road: '#32555b',
    building: '#2f2f2f',
    border: '#555555',
    farmland: '#192c30',
    wetland: '#1e3a34',
    forest: '#1b2e24',
    grass: '#1a2f29',
    text: '#000000',        // label/icon color
    textBorder: '#ffffff'   // label halo/border color
  };

  // Optional live-tweak hooks
  window.MAP_TEXT_COLOR = COLORS.text;
  window.MAP_TEXT_BORDER_COLOR = COLORS.textBorder;

  function maybeTransformStyle(obj) {
    if (!obj || typeof obj !== 'object') return obj;
    const looksLikeStyle = (obj.version === 8 || obj.version === 9) && Array.isArray(obj.layers);
    if (!looksLikeStyle) return obj;

    try {
      const out = JSON.parse(JSON.stringify(obj));
      out.layers.forEach(layer => {
        const id = (layer.id || '').toLowerCase();
        const type = layer.type || '';
        layer.paint = layer.paint || {};

        if (type === 'background') {
          layer.paint['background-color'] = COLORS.land;
          return;
        }
        if (id.includes('water')) {
          if (type === 'fill') layer.paint['fill-color'] = COLORS.water;
          if (type === 'line') layer.paint['line-color'] = COLORS.water;
        }
        if (id.includes('park') || id.includes('green') || id.includes('landuse')) {
          if (type === 'fill') layer.paint['fill-color'] = COLORS.park;
        }
        if (id.includes('farmland') || id.includes('crop')) {
          if (type === 'fill') layer.paint['fill-color'] = COLORS.farmland;
        }
        if (id.includes('forest') || id.includes('wood') || id.includes('trees')) {
          if (type === 'fill') layer.paint['fill-color'] = COLORS.forest;
        }
        if (id.includes('grass') || id.includes('lawn') || id.includes('meadow')) {
          if (type === 'fill') layer.paint['fill-color'] = COLORS.grass;
        }
        if (id.includes('wetland') || id.includes('swamp') || id.includes('marsh')) {
          if (type === 'fill') {
            delete layer.paint['fill-pattern'];
            layer.paint['fill-color'] = COLORS.wetland;
          }
        }
        if (id.includes('building')) {
          if (type === 'fill') layer.paint['fill-color'] = COLORS.building;
          if (type === 'fill-extrusion') {
            layer.paint['fill-extrusion-color'] = COLORS.building;
            if (typeof layer.paint['fill-extrusion-opacity'] === 'undefined') {
              layer.paint['fill-extrusion-opacity'] = 0.9;
            }
          }
        }
        if (type === 'line' && (id.includes('road') || id.includes('highway') || id.includes('street'))) {
          layer.paint['line-color'] = COLORS.road;
        }
        if (type === 'line' && (id.includes('border') || id.includes('admin') || id.includes('boundary'))) {
          layer.paint['line-color'] = COLORS.border;
        }
        if (type === 'symbol') {
          if (layer.layout && layer.layout['text-field']) {
            layer.paint['text-color'] = window.MAP_TEXT_COLOR || COLORS.text;
            layer.paint['text-halo-color'] = window.MAP_TEXT_BORDER_COLOR || COLORS.textBorder;
            layer.paint['text-halo-width'] = layer.paint['text-halo-width'] || 1.0;
          }
          if (layer.layout && layer.layout['icon-image']) {
            layer.paint['icon-color'] = window.MAP_TEXT_COLOR || COLORS.text;
          }
        }
      });

      const hasBackground = out.layers.some(l => l.type === 'background');
      if (!hasBackground) {
        out.layers.unshift({
          id: 'zbg',
          type: 'background',
          paint: { 'background-color': COLORS.land }
        });
      }
      return out;
    } catch (e) {
      if (DEBUG) console.debug('[Theme] Transform failed:', e);
      return obj;
    }
  }

  function cloneHeadersWithJSON(orig) {
    const h = new Headers();
    try {
      orig.forEach((v, k) => {
        if (k.toLowerCase() !== 'content-length') h.set(k, v);
      });
    } catch (_) {}
    h.set('content-type', 'application/json; charset=utf-8');
    return h;
  }

  const origJson = Response.prototype.json;
  Response.prototype.json = function () {
    return origJson.call(this).then(obj => {
      const transformed = maybeTransformStyle(obj);
      if (DEBUG && transformed !== obj) console.debug('[Theme] Style transformed via Response.json');
      return transformed;
    });
  };

  const origFetch = window.fetch;
  window.fetch = async function (...args) {
    const res = await origFetch.apply(this, args);
    try {
      const url = args[0] instanceof Request ? args[0].url : String(args[0]);
      const ct = (res.headers.get('content-type') || '').toLowerCase();
      const likelyJSON = ct.includes('application/json') || /\.json(\?|#|$)/i.test(url);
      if (!likelyJSON) return res;

      const clone = res.clone();
      const obj = await origJson.call(clone).catch(() => null);
      const transformed = maybeTransformStyle(obj);
      if (transformed && transformed !== obj) {
        if (DEBUG) console.debug('[Theme] Style transformed via fetch for', url);
        const headers = cloneHeadersWithJSON(res.headers);
        const body = JSON.stringify(transformed);
        return new Response(body, {
          status: res.status,
          statusText: res.statusText,
          headers
        });
      }
    } catch (e) {
      if (DEBUG) console.debug('[Theme] fetch hook error:', e);
    }
    return res;
  };

  const tryPatchSetStyle = () => {
    const lib = window.maplibregl || window.mapboxgl;
    if (!lib || !lib.Map || !lib.Map.prototype) return false;
    const proto = lib.Map.prototype;
    if (proto.__themed__) return true;

    const origSetStyle = proto.setStyle;
    proto.setStyle = function (style, options) {
      const transformed = typeof style === 'object' ? maybeTransformStyle(style) : style;
      return origSetStyle.call(this, transformed, options);
    };
    proto.__themed__ = true;
    if (DEBUG) console.debug('[Theme] Patched Map.setStyle');
    return true;
  };

  const int = setInterval(() => {
    if (tryPatchSetStyle()) clearInterval(int);
  }, 50);
})();

// ==UserScript==
// @name        Evades.io Tracers
// @namespace   Violentmonkey Scripts
// @match       *://evades.io/*
// @grant       none
// @version     1.1
// @author      Drik
// @description Correction, the tracers are now tracing accurately, not crookedly
// @run-at      document-idle
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/537180/Evadesio%20Tracers.user.js
// @updateURL https://update.greasyfork.org/scripts/537180/Evadesio%20Tracers.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const c = {
    e: true,
    m: 1000,
    t: 2,
    l: true,
    f: '12px Arial',
    o: { x: 4, y: -4 },
    r: 20
  };

  window.addEventListener('keydown', k => {
    if (k.key === 'F4') c.e = !c.e;
  });

  const s = 'div.quests-launcher';
  let fb, g, renderer;

  function gS() {
    const el = document.querySelector(s);
    if (!el) return false;
    fb = Object.keys(el).find(k => k.startsWith('__reactFiber$'));
    const stateNode = el[fb]?.memoizedProps?.children?._owner?.stateNode;
    if (!stateNode) return false;
    g = stateNode.gameState;
    renderer = stateNode.renderer;
    return !!(g?.entities && g.areaInfo?.self?.entity && renderer?.camera);
  }

  function dT() {
    if (!c.e || !gS()) return;
    const cv = document.querySelector('canvas');
    const ct = cv.getContext('2d');
    const w = cv.width;
    const h = cv.height;
    const p = g.areaInfo.self.entity;
    const cam = renderer.camera;
    const scale = cam.originalGameScale;
    const left = cam.left;
    const top = cam.top;

    ct.save();
    ct.lineWidth = c.t;
    ct.font = c.f;

    Object.values(g.entities).forEach(e => {
      if (!e.isEnemy) return;
      const worldX = e.x;
      const worldY = e.y;
      const sx = (worldX - left) * scale;
      const sy = (worldY - top) * scale;
      const rr = (typeof e.radius === 'number' ? e.radius : c.r) * scale;
      const cx = w / 2;
      const cy = h / 2;
      const a = Math.atan2(sy - cy, sx - cx);
      const ax = sx - Math.cos(a) * rr;
      const ay = sy - Math.sin(a) * rr;

      ct.strokeStyle = e.color || '#ff0';
      ct.beginPath();
      ct.moveTo(cx, cy);
      ct.lineTo(ax, ay);
      ct.stroke();

      if (c.l) {
        ct.fillStyle = e.color || '#ff0';
        const dist = Math.hypot(worldX - p.x, worldY - p.y);
        ct.fillText(Math.round(dist), ax + c.o.x, ay + c.o.y);
      }
    });

    ct.restore();
  }

  const rAF = window.requestAnimationFrame;
  window.requestAnimationFrame = cb => rAF(t => {
    cb(t);
    dT();
  });

})();

// ==UserScript==
// @name         AtCoder Graph Visualizer
// @namespace    https://example.com/
// @version      1.3.0
// @description  入力例のグラフを推定して、頂点と辺をSVG描画
// @match        https://atcoder.jp/contests/*/tasks/*
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546107/AtCoder%20Graph%20Visualizer.user.js
// @updateURL https://update.greasyfork.org/scripts/546107/AtCoder%20Graph%20Visualizer.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function el(tag, attrs = {}, children = []) {
    const e = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === 'style' && typeof v === 'object') Object.assign(e.style, v);
      else if (k.startsWith('on') && typeof v === 'function') e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v);
    });
    (Array.isArray(children) ? children : [children]).forEach(c => {
      if (c == null) return;
      if (typeof c === 'string') e.appendChild(document.createTextNode(c));
      else e.appendChild(c);
    });
    return e;
  }

  function parseInts(line) {
    return (line.match(/-?\d+/g) || []).map(s => Number(s));
  }

  function parseGraphFromSample(sampleText, forceTree = false) {
    const lines = sampleText.replace(/\t/g, ' ').replace(/\r/g, '').split('\n')
      .map(s => s.trim()).filter(s => s.length > 0);
    const rows = lines.map(parseInts).filter(a => a.length > 0);
    if (rows.length === 0) return null;

    let N = null, M = null, edgeStartIdx = null;

    if (forceTree) {
      N = rows[0][0];
      M = N - 1;
      edgeStartIdx = 1;
    } else if (rows[0].length >= 2) {
      N = rows[0][0];
      M = rows[0][1];
      edgeStartIdx = 1;
    } else if (rows[0].length === 1) {
      if (rows.length >= 2 && rows[1].length === 1) {
        N = rows[0][0];
        M = rows[1][0];
        edgeStartIdx = 2;
      } else {
        N = rows[0][0];
        const edgeCandidates = rows.slice(1).filter(a => a.length >= 2);
        if (edgeCandidates.length === N - 1 && N >= 2) {
          M = N - 1;
          edgeStartIdx = 1;
        } else {
          return null;
        }
      }
    } else {
      return null;
    }

    const edges = [];
    let maxV = N || 0;
    for (let i = 0; i < M; i++) {
      const idx = edgeStartIdx + i;
      if (idx >= rows.length) break;
      const a = rows[idx];
      if (a.length < 2) break;
      const u = a[0], v = a[1];
      const w = a.length >= 3 ? a[2] : null;
      edges.push({ u, v, w });
      maxV = Math.max(maxV, u, v);
    }

    if (edges.length === 0) return null;
    const V = Math.max(N || 0, maxV);
    if (!(V >= 1) || !(edges.length >= 1)) return null;
    return { N: V, M: edges.length, edges };
  }

  function renderGraphSVG(graph, opts, width = 420, height = 420) {
    const { N, edges } = graph;
    const { directed, weighted } = opts;
    const margin = 24;
    const cx = width / 2, cy = height / 2;
    const R = Math.min(width, height) / 2 - margin;

    const pos = new Map();
    for (let i = 1; i <= N; i++) {
      const theta = (2 * Math.PI * (i - 1)) / N - Math.PI / 2;
      pos.set(i, { x: cx + R * Math.cos(theta), y: cy + R * Math.sin(theta) });
    }

    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', String(width));
    svg.setAttribute('height', String(height));
    svg.style.display = 'block';
    svg.style.border = '1px solid #ddd';
    svg.style.borderRadius = '12px';
    svg.style.marginTop = '8px';
    svg.style.background = 'white';

    if (directed) {
      const defs = document.createElementNS(svgNS, 'defs');
      const marker = document.createElementNS(svgNS, 'marker');
      marker.setAttribute('id', 'arrowhead');
      marker.setAttribute('markerWidth', '10');
      marker.setAttribute('markerHeight', '7');
      marker.setAttribute('refX', '10');
      marker.setAttribute('refY', '3.5');
      marker.setAttribute('orient', 'auto');
      const path = document.createElementNS(svgNS, 'path');
      path.setAttribute('d', 'M0,0 L10,3.5 L0,7 Z');
      path.setAttribute('fill', '#555');
      marker.appendChild(path);
      defs.appendChild(marker);
      svg.appendChild(defs);
    }

    edges.forEach(({ u, v, w }) => {
      const pu = pos.get(u), pv = pos.get(v);
      if (!pu || !pv) return;
      const line = document.createElementNS(svgNS, 'line');
      line.setAttribute('x1', pu.x.toFixed(2));
      line.setAttribute('y1', pu.y.toFixed(2));
      line.setAttribute('x2', pv.x.toFixed(2));
      line.setAttribute('y2', pv.y.toFixed(2));
      line.setAttribute('stroke', '#888');
      line.setAttribute('stroke-width', '1.5');
      if (directed) line.setAttribute('marker-end', 'url(#arrowhead)');
      svg.appendChild(line);

      if (weighted && w != null) {
        const tx = (pu.x + pv.x) / 2, ty = (pu.y + pv.y) / 2;
        const label = document.createElementNS(svgNS, 'text');
        label.setAttribute('x', tx.toFixed(2));
        label.setAttribute('y', ty.toFixed(2));
        label.setAttribute('font-size', '11');
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('dominant-baseline', 'central');
        label.setAttribute('fill', '#444');
        label.textContent = String(w);
        svg.appendChild(label);
      }
    });

    for (let i = 1; i <= N; i++) {
      const { x, y } = pos.get(i);
      const g = document.createElementNS(svgNS, 'g');
      const circle = document.createElementNS(svgNS, 'circle');
      circle.setAttribute('cx', x.toFixed(2));
      circle.setAttribute('cy', y.toFixed(2));
      circle.setAttribute('r', '12');
      circle.setAttribute('fill', '#f5f5f5');
      circle.setAttribute('stroke', '#333');
      circle.setAttribute('stroke-width', '1.5');
      g.appendChild(circle);

      const text = document.createElementNS(svgNS, 'text');
      text.setAttribute('x', x.toFixed(2));
      text.setAttribute('y', y.toFixed(2));
      text.setAttribute('font-size', '12');
      text.setAttribute('font-weight', '600');
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dominant-baseline', 'central');
      text.textContent = String(i);
      g.appendChild(text);

      svg.appendChild(g);
    }

    return svg;
  }

  function findSamplePreBlocks() {
    const pres = [];
    const headings = Array.from(document.querySelectorAll('h3, h4'));
    headings.forEach(h => {
      const txt = (h.textContent || '').trim();
      if (/入力例|Sample Input/i.test(txt)) {
        let el = h.nextElementSibling;
        while (el && el.tagName.toLowerCase() !== 'pre') el = el.nextElementSibling;
        if (el && el.tagName.toLowerCase() === 'pre') pres.push(el);
      }
    });
    return pres;
  }

  function removeAllGraphs() {
    document.querySelectorAll('.ac-graph-viz-container').forEach(e => e.remove());
  }

  function tryRenderForPre(pre) {
    if (!pre) return;
    const text = pre.textContent || '';

    let directed = false;
    let forceTree = false;
    let weighted = false;
    const svgArea = el('div', {});

    function redraw() {
      svgArea.innerHTML = '';
      const graph = parseGraphFromSample(text, forceTree);
      if (graph) {
        svgArea.appendChild(renderGraphSVG(graph, { directed, weighted }));
      } else {
        svgArea.appendChild(el('div', { style: { fontSize: '12px', color: '#a00' } },
          'グラフ入力を検出できなかったため描画をスキップした。'));
      }
    }

    const directedBox = el('input', { type: 'checkbox', onchange: e => { directed = e.target.checked; redraw(); } });
    const treeBox = el('input', { type: 'checkbox', onchange: e => { forceTree = e.target.checked; redraw(); } });
    const weightedBox = el('input', { type: 'checkbox', onchange: e => { weighted = e.target.checked; redraw(); } });

    const header = el('div', {
      style: {
        fontSize: '12px',
        color: '#555',
        marginBottom: '6px',
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
        flexWrap: 'wrap',
      }
    }, [
      el('span', {}, '🗺️ グラフ可視化（推定）'),
      el('label', {}, [directedBox, ' 有向グラフ']),
      el('label', {}, [treeBox, ' 木としてみる']),
      el('label', {}, [weightedBox, ' 重み付きグラフ'])
    ]);

    const container = el('div', {
      class: 'ac-graph-viz-container',
      style: { marginTop: '8px', marginBottom: '20px' }
    }, [header, svgArea]);

    pre.parentNode.insertBefore(container, pre.nextSibling);
    redraw();
  }

  // --- ボタンを「入出力の形式」の下に置く ---
  function injectToggle() {
    const headings = Array.from(document.querySelectorAll('h3, h4'));
    const target = headings.find(h => /入出力|入力/.test(h.textContent || ''));
    if (!target) return;

    if (document.getElementById('graph-toggle-container')) return;

    let enabled = false;
    const chk = el('input', { type: 'checkbox', id: 'graph-toggle-checkbox' });
    chk.addEventListener('change', () => {
      enabled = chk.checked;
      removeAllGraphs();
      if (enabled) {
        findSamplePreBlocks().forEach(tryRenderForPre);
      }
    });

    const container = el('div',
      {
        id: 'graph-toggle-container',
        style: { margin: '6px 0', fontSize: '13px', color: '#333' }
      },
      [el('label', {}, [chk, ' 入力例からグラフを描画する'])]
    );

    target.parentNode.insertBefore(container, target.nextSibling);
  }

  function main() {
    injectToggle();
  }

  main();
  const mo = new MutationObserver(() => main());
  mo.observe(document.documentElement, { childList: true, subtree: true });
})();

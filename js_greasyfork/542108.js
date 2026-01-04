// ==UserScript==
// @name         Calculator
// @version      1.2
// @author       Mane
// @license      CC0-1.0
// @description  Calculator corner button with dark/light theme, skins, custom font/size, full/paged history.
// @match        *://*/*
// @run-at       document-end
// @namespace https://greasyfork.org/users/1491313
// @downloadURL https://update.greasyfork.org/scripts/542108/Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/542108/Calculator.meta.js
// ==/UserScript==

;(function(){
  'use strict';

  // --- KEYS ---
  const KEY_EXPR   = 'cc_expr';
  const KEY_HIST   = 'cc_hist';
  const KEY_THEME  = 'cc_theme';
  const KEY_MEM    = 'cc_mem';
  const KEY_ACC    = 'cc_accent';
  const KEY_FONT   = 'cc_font';
  const KEY_FS     = 'cc_font_size';

  // --- STATE ---
  let expr    = localStorage.getItem(KEY_EXPR)     || '';
  let theme   = localStorage.getItem(KEY_THEME)    || 'dark';
  let history = [];
  let mem     = parseFloat(localStorage.getItem(KEY_MEM) || '0');
  let accent  = localStorage.getItem(KEY_ACC)      || '#007acc';
  let font    = localStorage.getItem(KEY_FONT)     || 'sans-serif';
  let fs      = localStorage.getItem(KEY_FS)       || '16';

  // --- STYLES ---
  const css = `
    :root {
      --bg:#1e1e1e;--fg:#f1f1f1;--btn-bg:#333;--btn-fg:#f1f1e1;--accent:#007acc;
    }
    [data-theme="light"]{
      --bg:#f1f1f1;--fg:#1e1e1e;--btn-bg:#ddd;--btn-fg:#1e1e1e;--accent:#005a9e;
    }
    #cc-toggle {
      position:fixed;bottom:20px;right:20px;width:36px;height:36px;
      background:var(--accent);color:#fff;border:none;border-radius:4px;
      cursor:pointer;z-index:999999;font-size:18px;
    }
    #cc-panel {
      position:fixed;bottom:60px;right:20px;width:320px;
      background:var(--bg);color:var(--fg);padding:10px;
      border-radius:6px;box-shadow:0 4px 12px rgba(0,0,0,.3);
      font-family:sans-serif;display:none;z-index:999999;
    }
    .small-btn {
      position:absolute;width:24px;height:24px;
      border:none;border-radius:4px;cursor:pointer;
      background:var(--btn-bg);color:var(--btn-fg);
      font-size:14px;line-height:1;
    }
    #cc-theme {top:8px;left:8px;}
    #cc-skin  {top:8px;right:44px;}
    #cc-history-toggle {top:8px;right:8px;}
    #cc-display {
      flex:1;height:36px;
      padding:0 8px;font-size:18px;text-align:right;
      background:var(--btn-bg);color:var(--fg);border:none;
    }
    #cc-copy {
      margin-left:6px;
      background:var(--btn-bg);color:var(--btn-fg);
      border:none;border-radius:4px;cursor:pointer;
      font-size:18px;height:36px;width:36px;
    }
    .cc-row{display:flex;margin:4px 0}
    .cc-btn{
      flex:1;margin:2px;height:32px;
      background:var(--btn-bg);color:var(--btn-fg);
      border:none;border-radius:4px;cursor:pointer;
      font-size:16px;
    }
    .cc-op{background:var(--accent);color:#fff}
    #cc-history {
      display:none;margin-top:8px;
      max-height:140px;overflow:auto;
      background:var(--btn-bg);padding:6px;border-radius:4px;
    }
    #cc-history header{
      margin-bottom:4px;
    }
    #cc-history ul{
      list-style:none;padding:0;margin:0;font-size:14px;
    }
    #cc-history li{
      padding:2px 0;border-bottom:1px solid rgba(255,255,255,.1);
      cursor:pointer;
    }
    #cc-history button {
      width:48%;margin:4px 1%;padding:4px;
      background:var(--btn-bg);color:var(--btn-fg);
      border:none;border-radius:4px;cursor:pointer;
    }
    #cc-settings {
      display:none;margin-top:8px;
      background:var(--btn-bg);color:var(--btn-fg);
      padding:6px;border-radius:4px;font-size:14px;
    }
    #cc-settings label {display:block;margin-bottom:6px;}
    #cc-settings input, #cc-settings select {
      margin-left:6px;
    }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // --- APPLY THEME & SKIN ---
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.style.setProperty('--accent', accent);

  // --- BUILD UI ---
  const toggle = document.createElement('button');
  toggle.id = 'cc-toggle';
  toggle.textContent = '🖩';
  document.body.appendChild(toggle);

  const panel = document.createElement('div');
  panel.id = 'cc-panel';
  panel.innerHTML = `
    <button id="cc-theme" class="small-btn">${theme==='dark'?'☀️':'🌙'}</button>
    <button id="cc-skin"  class="small-btn">⚙️</button>
    <button id="cc-history-toggle" class="small-btn">📜</button>
    <div style="display:flex;align-items:center;margin:32px 0 8px;">
      <input id="cc-display" type="text"/>
      <button id="cc-copy" title="Copy">📋</button>
    </div>
    <div class="cc-row">
      <button class="cc-btn cc-op">π</button>
      <button class="cc-btn cc-op">e</button>
      <button class="cc-btn cc-op">ln</button>
      <button class="cc-btn cc-op">exp</button>
    </div>
    <div class="cc-row">
      <button class="cc-btn cc-op">^</button>
      <button class="cc-btn cc-op">%</button>
      <button class="cc-btn cc-op">!</button>
      <div style="flex:1;margin:2px"></div>
    </div>
    <div class="cc-row">
      <button class="cc-btn">M+</button>
      <button class="cc-btn">M-</button>
      <button class="cc-btn">MR</button>
      <button class="cc-btn">MC</button>
    </div>
    <div class="cc-row">
      <button class="cc-btn">7</button><button class="cc-btn">8</button>
      <button class="cc-btn">9</button><button class="cc-btn cc-op">/</button>
    </div>
    <div class="cc-row">
      <button class="cc-btn">4</button><button class="cc-btn">5</button>
      <button class="cc-btn">6</button><button class="cc-btn cc-op">*</button>
    </div>
    <div class="cc-row">
      <button class="cc-btn">1</button><button class="cc-btn">2</button>
      <button class="cc-btn">3</button><button class="cc-btn cc-op">-</button>
    </div>
    <div class="cc-row">
      <button class="cc-btn">0</button><button class="cc-btn">.</button>
      <button class="cc-btn cc-op">=</button><button class="cc-btn cc-op">+</button>
    </div>
    <div class="cc-row">
      <button class="cc-btn cc-op">(</button>
      <button class="cc-btn cc-op">)</button>
      <button class="cc-btn">←</button>
      <button class="cc-btn">C</button>
    </div>
    <div class="cc-row">
      <button class="cc-btn">√</button>
      <button class="cc-btn" style="visibility:hidden"></button>
      <button class="cc-btn" style="visibility:hidden"></button>
      <button class="cc-btn" style="visibility:hidden"></button>
    </div>
    <div id="cc-history">
      <header><strong>History</strong></header>
      <ul></ul>
      <button id="cc-clear">Clear</button>
      <button id="cc-copy-all">Copy All</button>
    </div>
    <div id="cc-settings">
      <label>Accent:<input type="color" id="cc-accent-picker" value="${accent}"></label>
      <label>Font:<select id="cc-font-picker">
        <option value="sans-serif">Sans</option>
        <option value="monospace">Mono</option>
      </select></label>
      <label>Size:<input type="number" id="cc-font-size" min="12" max="24" value="${fs}" style="width:50px">px</label>
    </div>
  `;
  document.body.appendChild(panel);

  // --- APPLY FONT & SIZE ---
  panel.style.fontFamily = font;
  panel.style.fontSize   = fs + 'px';

  // --- ELEMENTS ---
  const disp        = panel.querySelector('#cc-display');
  disp.value        = expr;
  const settingsDiv = panel.querySelector('#cc-settings');

  // --- EVENTS ---
  toggle.addEventListener('click', () => {
    panel.style.display = panel.style.display==='block'?'none':'block';
  });

  panel.addEventListener('click', e => {
    const b = e.target, v = b.textContent;

    // theme toggle
    if (b.id==='cc-theme') {
      theme = theme==='dark'?'light':'dark';
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem(KEY_THEME, theme);
      b.textContent = theme==='dark'?'☀️':'🌙';
      return;
    }

    // skin/settings toggle
    if (b.id==='cc-skin') {
      settingsDiv.style.display = settingsDiv.style.display==='block'?'none':'block';
      return;
    }

    // history toggle
    if (b.id==='cc-history-toggle') {
      const h = panel.querySelector('#cc-history');
      const open = h.style.display!=='block';
      h.style.display = open?'block':'none';
      if(open){ loadHistory(); renderHistory(); }
      return;
    }

    // clear history
    if (b.id==='cc-clear') {
      history = []; saveHistory(); renderHistory();
      return;
    }

    // copy all history
    if (b.id==='cc-copy-all') {
      const txt = history.map(it=>`${it.input} = ${it.result}`).join('\n');
      navigator.clipboard.writeText(txt).catch(console.error);
      return;
    }

    // copy display
    if (b.id==='cc-copy') {
      navigator.clipboard.writeText(expr).catch(console.error);
      return;
    }

    // memory
    if (['M+','M-','MR','MC'].includes(v)) {
      const cur = parseFloat(expr)||0;
      if(v==='M+') mem+=cur;
      if(v==='M-') mem-=cur;
      if(v==='MR'){ expr=String(mem); updateDisplay(); }
      if(v==='MC') mem=0;
      localStorage.setItem(KEY_MEM, mem);
      return;
    }

    // delete last char
    if (v==='←') {
      expr = expr.slice(0, -1);
      updateDisplay();
      return;
    }

    // clear all
    if (v==='C') {
      expr = '';
      updateDisplay();
      return;
    }

    // calculator buttons
    if (b.classList.contains('cc-btn')) {
      if (v==='=') { evaluate(); }
      else { expr += v; updateDisplay(); }
    }
  });

  // paste into display
  disp.addEventListener('paste', e => {
    e.preventDefault();
    const txt = e.clipboardData.getData('text');
    expr = txt.replace(/[^\d+\-*/().√πeexpeln!%^sincotanlog]/g,'');
    updateDisplay();
  });

  // settings inputs
  panel.querySelector('#cc-accent-picker')
    .addEventListener('input', e => {
      accent = e.target.value;
      document.documentElement.style.setProperty('--accent', accent);
      localStorage.setItem(KEY_ACC, accent);
    });
  panel.querySelector('#cc-font-picker')
    .addEventListener('input', e => {
      font = e.target.value;
      panel.style.fontFamily = font;
      localStorage.setItem(KEY_FONT, font);
    });
  panel.querySelector('#cc-font-size')
    .addEventListener('input', e => {
      fs = e.target.value;
      panel.style.fontSize = fs + 'px';
      localStorage.setItem(KEY_FS, fs);
    });

  // --- CALC LOGIC ---
  function evaluate(){
    try {
      const factorial = n=>n<2?1:n*factorial(n-1);
      let safe = expr
        .replace(/√/g,'Math.sqrt')
        .replace(/π/g,'Math.PI')
        .replace(/\be\b/g,'Math.E')
        .replace(/\bln\b/g,'Math.log')
        .replace(/\bexp\b/g,'Math.exp')
        .replace(/\^/g,'**')
        .replace(/(\d+)!/g,'factorial($1)')
        .replace(/\b(sin|cos|tan|log)\b/g,'Math.$1');
      const res = Function('Math','factorial','return '+safe)(Math,factorial);
      history.unshift({input:expr, result:res});
      history = history.slice(0,50);
      saveHistory();
      expr = String(res);
    } catch {
      expr = 'Error';
    }
    updateDisplay();
  }

  function updateDisplay(){
    disp.value = expr;
    localStorage.setItem(KEY_EXPR, expr);
  }

  // --- HISTORY & STORAGE ---
  function loadHistory(){
    history = JSON.parse(localStorage.getItem(KEY_HIST)||'[]');
  }
  function saveHistory(){
    localStorage.setItem(KEY_HIST, JSON.stringify(history));
  }
  function renderHistory(){
    const ul = panel.querySelector('#cc-history ul');
    ul.innerHTML = history.map(it=>
      `<li>${it.input} = ${it.result}</li>`
    ).join('');
    ul.querySelectorAll('li').forEach((li,i)=>
      li.addEventListener('click',()=>{
        expr = history[i].input;
        updateDisplay();
      })
    );
  }

})();

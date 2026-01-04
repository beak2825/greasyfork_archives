// ==UserScript==
// @name         AutoScroller UI Plus ✨
// @namespace    https://example.com/
// @version      0.5
// @description  自动滚动页面，rAF 丝滑驱动 + 可调速面板（兼容无限下拉）
// @author       你
// @license      MIT
// @match        *://*/*
// @icon         https://example.com/icon.png
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/535860/AutoScroller%20UI%20Plus%20%E2%9C%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/535860/AutoScroller%20UI%20Plus%20%E2%9C%A8.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* ——— 可自定义变量 ——— */
  let su_du = 200;        // 滚动速度（px / 秒）← 可自定义
  let yun_xing = false;   // 运行标志
  let shang_ci = 0;       // 上次帧时间戳

  /* ——— 创建 UI ——— */
  const kuang = document.createElement('div');
  kuang.id = 'autoScrollerPanel';
  kuang.innerHTML = `
    <header id="tiaoTi">
      自动滚动 ⇲
      <button id="guanBiBtn" title="关闭">✖</button>
    </header>
    <div class="neiRong">
      <label>速度(px/s):
        <input type="number" id="suDuInput" value="${su_du}" />
      </label>
      <div class="btns">
        <button id="kaiShiBtn">开始 🚀</button>
        <button id="tingZhiBtn">停止 🛑</button>
      </div>
    </div>
  `;
  document.body.appendChild(kuang);

  /* ——— 样式 ——— */
  GM_addStyle(`
    :root{
      --as-main:#6366f1;
      --as-main-light:#8b97ff;
      --as-bg:rgba(255,255,255,0.85);
    }
    #autoScrollerPanel{
      position:fixed; bottom:20px; right:20px;
      width:190px; border-radius:12px; z-index:9999;
      box-shadow:0 4px 18px rgba(0,0,0,.15);
      backdrop-filter:blur(10px); background:var(--as-bg);
      font-size:14px; color:#111; user-select:none;
      transition:box-shadow .2s;
    }
    #autoScrollerPanel header{
      background:var(--as-main); color:#fff;
      padding:8px 12px; border-radius:12px 12px 0 0;
      cursor:move; font-weight:600; letter-spacing:.5px;
      display:flex; align-items:center; justify-content:space-between;
    }
    #autoScrollerPanel #guanBiBtn{
      background:transparent; border:none; color:#fff; font-size:16px;
      cursor:pointer; line-height:1; padding:0 4px;
    }
    #autoScrollerPanel #guanBiBtn:hover{opacity:0.8;}
    #autoScrollerPanel .neiRong{padding:12px 14px;}
    #autoScrollerPanel input{
      width:78px; margin-left:4px; padding:2px 4px;
      border:1px solid #ccc; border-radius:6px;
    }
    #autoScrollerPanel .btns{margin-top:10px; display:flex; gap:8px;}
    #autoScrollerPanel button:not(#guanBiBtn){
      flex:1; padding:6px 0; border:none; border-radius:8px;
      background:var(--as-main); color:#fff; font-weight:500;
      box-shadow:0 2px 6px rgba(0,0,0,.15);
      transition:transform .2s, background .2s, box-shadow .2s;
      cursor:pointer;
    }
    #autoScrollerPanel button:not(#guanBiBtn):hover{
      background:var(--as-main-light); transform:translateY(-2px);
      box-shadow:0 6px 12px rgba(0,0,0,.2);
    }
  `);

  /* ——— 事件 ——— */
  const suDuInput = kuang.querySelector('#suDuInput');
  const kaiShiBtn = kuang.querySelector('#kaiShiBtn');
  const tingZhiBtn = kuang.querySelector('#tingZhiBtn');
  const guanBiBtn = kuang.querySelector('#guanBiBtn');

  kaiShiBtn.addEventListener('click', () => {
    su_du = parseFloat(suDuInput.value) || su_du;
    if (yun_xing) return;          // 已在跑
    yun_xing = true;
    shang_ci = 0;
    requestAnimationFrame(gunDong);
  });

  tingZhiBtn.addEventListener('click', () => {
    yun_xing = false;
  });

  // 关闭按钮：停止 + 隐藏面板
  guanBiBtn.addEventListener('click', () => {
    yun_xing = false;
    kuang.remove();
  });

  /* ——— 核心滚动 (rAF) ——— */
  function gunDong(time){
    if (!yun_xing) return;
    if (!shang_ci) shang_ci = time;
    const cha = time - shang_ci;           // Δt (ms)
    const bu_chang = su_du * cha / 1000;   // Δs = 速度 * 时间
    const diBuCha = document.body.scrollHeight - (window.scrollY + window.innerHeight);

    if (diBuCha > 0) window.scrollBy(0, bu_chang);
    // 到底部但可能懒加载 → 维持循环
    shang_ci = time;
    requestAnimationFrame(gunDong);
  }

  /* ——— 面板拖拽 ——— */
  (function drag(el, handle){
    let startX, startY, startL, startT, z = 9999;
    handle.addEventListener('mousedown', e=>{
      startX = e.clientX; startY = e.clientY;
      const rect = el.getBoundingClientRect();
      startL = rect.left; startT = rect.top;
      el.style.transition = 'none';
      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up, {once:true});
      e.preventDefault();
    });
    function move(e){
      el.style.left = startL + (e.clientX - startX) + 'px';
      el.style.top  = startT + (e.clientY - startY) + 'px';
      el.style.right = 'auto'; el.style.bottom = 'auto';
      el.style.position = 'fixed'; el.style.zIndex = ++z;
    }
    function up(){ document.removeEventListener('mousemove', move); }
  })(kuang, kuang.querySelector('#tiaoTi'));
})();

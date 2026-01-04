// ==UserScript==
// @name         Faucet Dashboard (ClaimFreeCoins + BeeFaucet)
// @namespace    faucet-helper
// @version      2.2
// @description  Виджет для кранов: автозаполнение адреса, открытие вкладок, фокус на капче, авто-клик Claim ПОСЛЕ ручного решения капчи. Не закрывает капчу.
// @author       BleemV
// @match        *://*/*
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=claimfreecoins.io
// @noframes
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/546131/Faucet%20Dashboard%20%28ClaimFreeCoins%20%2B%20BeeFaucet%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546131/Faucet%20Dashboard%20%28ClaimFreeCoins%20%2B%20BeeFaucet%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ------------------ CONFIG ------------------
  const DEFAULT_EMAIL = "sstels215@gmail.com";
  const EMAIL = GM_getValue("fp_email", DEFAULT_EMAIL);
  const POPUP_BLOCK = GM_getValue("fp_block_popups", true);
  const AUTO_CLICK_AFTER_SOLVED = GM_getValue("fp_autoclick_after_solved", true);

  const DOMAINS = ["claimfreecoins.io", "beefaucet.org"];

  // Списки кранов
  const FAUCETS = [
    // ClaimFreeCoins
    { d: "claimfreecoins.io", coin: "Bitcoin",     url: (e)=>`https://claimfreecoins.io/bitcoin-faucet/?r=${e}` },
    { d: "claimfreecoins.io", coin: "Dogecoin",    url: (e)=>`https://claimfreecoins.io/dogecoin-faucet/?r=${e}` },
    { d: "claimfreecoins.io", coin: "Litecoin",    url: (e)=>`https://claimfreecoins.io/litecoin-faucet/?r=${e}` },
    { d: "claimfreecoins.io", coin: "Tron",        url: (e)=>`https://claimfreecoins.io/tron-faucet/?r=${e}` },
    { d: "claimfreecoins.io", coin: "BNB",         url: (e)=>`https://claimfreecoins.io/bnb-faucet/?r=${e}` },
    { d: "claimfreecoins.io", coin: "Solana",      url: (e)=>`https://claimfreecoins.io/solana-faucet/?r=${e}` },
    { d: "claimfreecoins.io", coin: "Tether (USDT)",url:(e)=>`https://claimfreecoins.io/tether-faucet/?r=${e}` },
    { d: "claimfreecoins.io", coin: "Polygon",     url: (e)=>`https://claimfreecoins.io/polygon-faucet/?r=${e}` },
    { d: "claimfreecoins.io", coin: "Ethereum",    url: (e)=>`https://claimfreecoins.io/ethereum-faucet/?r=${e}` },
    { d: "claimfreecoins.io", coin: "BCH",         url: (e)=>`https://claimfreecoins.io/bch-faucet/?r=${e}` },
    { d: "claimfreecoins.io", coin: "Dash",        url: (e)=>`https://claimfreecoins.io/dash-faucet/?r=${e}` },
    { d: "claimfreecoins.io", coin: "Zcash",       url: (e)=>`https://claimfreecoins.io/zcash-faucet/?r=${e}` },
    { d: "claimfreecoins.io", coin: "DigiByte",    url: (e)=>`https://claimfreecoins.io/digibyte-faucet/?r=${e}` },
    { d: "claimfreecoins.io", coin: "Feyorra",     url: (e)=>`https://claimfreecoins.io/feyorra-faucet/?r=${e}` },
    { d: "claimfreecoins.io", coin: "USDC",        url: (e)=>`https://claimfreecoins.io/usdc-faucet/?r=${e}` },
    { d: "claimfreecoins.io", coin: "XRP",         url: (e)=>`https://claimfreecoins.io/ripple-faucet/?r=${e}` },
    { d: "claimfreecoins.io", coin: "Toncoin",     url: (e)=>`https://claimfreecoins.io/toncoin-faucet/?r=${e}` },
    { d: "claimfreecoins.io", coin: "Cardano",     url: (e)=>`https://claimfreecoins.io/cardano-faucet/?r=${e}` },
    { d: "claimfreecoins.io", coin: "Monero",      url: (e)=>`https://claimfreecoins.io/monero-faucet/?r=${e}` },
    { d: "claimfreecoins.io", coin: "Stellar",     url: (e)=>`https://claimfreecoins.io/stellar-faucet/?r=${e}` },

    // BeeFaucet
    { d: "beefaucet.org",     coin: "Bitcoin",     url: (e)=>`https://beefaucet.org/bitcoin-faucet/?r=${e}` },
    { d: "beefaucet.org",     coin: "Dogecoin",    url: (e)=>`https://beefaucet.org/dogecoin-faucet/?r=${e}` },
    { d: "beefaucet.org",     coin: "Litecoin",    url: (e)=>`https://beefaucet.org/litecoin-faucet/?r=${e}` },
    { d: "beefaucet.org",     coin: "Tron",        url: (e)=>`https://beefaucet.org/tron-faucet/?r=${e}` },
    { d: "beefaucet.org",     coin: "BNB",         url: (e)=>`https://beefaucet.org/bnb-faucet/?r=${e}` },
    { d: "beefaucet.org",     coin: "Solana",      url: (e)=>`https://beefaucet.org/solana-faucet/?r=${e}` },
    { d: "beefaucet.org",     coin: "USDT",        url: (e)=>`https://beefaucet.org/tether-faucet/?r=${e}` },
    { d: "beefaucet.org",     coin: "Polygon",     url: (e)=>`https://beefaucet.org/polygon-faucet/?r=${e}` },
    { d: "beefaucet.org",     coin: "Ethereum",    url: (e)=>`https://beefaucet.org/ethereum-faucet/?r=${e}` },
    { d: "beefaucet.org",     coin: "BCH",         url: (e)=>`https://beefaucet.org/bch-faucet/?r=${e}` },
    { d: "beefaucet.org",     coin: "Dash",        url: (e)=>`https://beefaucet.org/dash-faucet/?r=${e}` },
    { d: "beefaucet.org",     coin: "Zcash",       url: (e)=>`https://beefaucet.org/zcash-faucet/?r=${e}` },
    { d: "beefaucet.org",     coin: "DigiByte",    url: (e)=>`https://beefaucet.org/digibyte-faucet/?r=${e}` },
    { d: "beefaucet.org",     coin: "Feyorra",     url: (e)=>`https://beefaucet.org/feyorra-faucet/?r=${e}` },
    { d: "beefaucet.org",     coin: "USDC",        url: (e)=>`https://beefaucet.org/usdc-faucet/?r=${e}` },
    { d: "beefaucet.org",     coin: "XRP",         url: (e)=>`https://beefaucet.org/ripple-faucet/?r=${e}` },
    { d: "beefaucet.org",     coin: "Toncoin",     url: (e)=>`https://beefaucet.org/toncoin-faucet/?r=${e}` },
    { d: "beefaucet.org",     coin: "Cardano",     url: (e)=>`https://beefaucet.org/cardano-faucet/?r=${e}` },
    { d: "beefaucet.org",     coin: "Monero",      url: (e)=>`https://beefaucet.org/monero-faucet/?r=${e}` },
    { d: "beefaucet.org",     coin: "Stellar",     url: (e)=>`https://beefaucet.org/stellar-faucet/?r=${e}` },
  ];

  // ------------------ POPUP BLOCK ------------------
  if (POPUP_BLOCK) {
    try { unsafeWindow.open = function () { return null; }; } catch (_) {}
  }

  // ------------------ STYLES ------------------
  const css = `
  #fd-root{position:fixed;top:80px;right:20px;width:320px;background:#171923;color:#fff;border-radius:16px;box-shadow:0 8px 28px rgba(0,0,0,.5);font:14px/1.4 system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,'Helvetica Neue',Arial,sans-serif;z-index:999999999;overflow:hidden;border:1px solid rgba(255,255,255,.08)}
  #fd-header{background:linear-gradient(135deg,#ff9800,#ff6d00);padding:10px 12px;display:flex;align-items:center;justify-content:space-between;cursor:pointer}
  #fd-title{font-weight:800;font-size:15px}
  #fd-body{padding:10px;max-height:430px;overflow:auto;display:none}
  #fd-row{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:6px}
  .fd-btn{border:0;border-radius:10px;padding:9px 10px;font-weight:700;cursor:pointer;background:#2a2f45;color:#fff}
  .fd-btn.primary{background:#4caf50}
  .fd-btn.warn{background:#e64a19}
  .fd-input,.fd-select{width:100%;border:1px solid #333;border-radius:10px;background:#0f1220;color:#fff;padding:8px 10px;outline:none}
  .fd-note{font-size:12px;color:#9aa4b2;margin-top:6px}
  .fd-chip{display:inline-flex;align-items:center;gap:6px;background:#252b3f;color:#d9e3f0;border:1px solid #3a415c;border-radius:999px;padding:6px 10px;margin:4px 4px 0 0}
  .fd-link{color:#ffcc66;text-decoration:none}
  .fd-ghost{opacity:.15;pointer-events:none}
  #fd-footer{padding:8px 10px;border-top:1px solid rgba(255,255,255,.06);display:flex;gap:6px}
  .fd-small{font-size:12px;opacity:.8}
  .fd-badge{display:inline-block;background:#00bcd4;color:#001014;border-radius:8px;padding:2px 6px;font-weight:800;font-size:11px;margin-left:6px}
  .fd-outline{outline:3px solid #00e5ff55;border-radius:12px}
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // ------------------ UI ------------------
  const root = document.createElement('div');
  root.id = 'fd-root';
  root.innerHTML = `
    <div id="fd-header">
      <div><span id="fd-title">💰 Faucet Dashboard</span><span class="fd-badge">safe</span></div>
      <div id="fd-toggle">▾</div>
    </div>
    <div id="fd-body">
      <label class="fd-small">FaucetPay Email</label>
      <input id="fd-email" class="fd-input" type="email" value="${EMAIL}" placeholder="you@mail.com"/>

      <div class="fd-note">Под капчу скрипт НЕ лезет: он лишь помогает не мешать ей и нажимает Claim <b>после</b> того как вы решите капчу вручную.</div>

      <div id="fd-row" style="margin-top:8px">
        <button id="fd-open-cfc" class="fd-btn primary">Открыть ClaimFreeCoins</button>
        <button id="fd-open-bee" class="fd-btn primary">Открыть BeeFaucet</button>
        <button id="fd-open-all" class="fd-btn">Открыть все краны</button>
        <button id="fd-focus-captcha" class="fd-btn">Найти капчу</button>
      </div>

      <div id="fd-row">
        <button id="fd-ghost" class="fd-btn">👻 Призрачный режим</button>
        <button id="fd-autoclick" class="fd-btn">${AUTO_CLICK_AFTER_SOLVED ? "AutoClaim: ON" : "AutoClaim: OFF"}</button>
      </div>

      <div class="fd-note">Подсказки:
        <span class="fd-chip">Перетащи заголовок — двигается</span>
        <span class="fd-chip">Держит позицию</span>
        <span class="fd-chip">Не закрывает капчу</span>
      </div>

      <div class="fd-note" style="margin-top:10px">Быстрые ссылки:</div>
      <div id="fd-links" style="display:flex;flex-wrap:wrap;margin-bottom:8px"></div>
    </div>
    <div id="fd-footer">
      <button id="fd-save" class="fd-btn">💾 Сохранить</button>
      <button id="fd-collapse" class="fd-btn warn">Свернуть</button>
    </div>
  `;
  document.body.appendChild(root);

  // Свернуть/развернуть
  const bodyEl = root.querySelector('#fd-body');
  const toggleEl = root.querySelector('#fd-toggle');
  const collapsedSaved = GM_getValue('fd_collapsed', false);
  bodyEl.style.display = collapsedSaved ? 'none' : 'block';
  toggleEl.textContent = collapsedSaved ? '▸' : '▾';
  root.querySelector('#fd-header').addEventListener('click', () => {
    const now = bodyEl.style.display === 'none' ? 'block' : 'none';
    bodyEl.style.display = now;
    toggleEl.textContent = now === 'none' ? '▸' : '▾';
    GM_setValue('fd_collapsed', now === 'none');
  });

  // Перетаскивание + сохранение позиции
  (function drag() {
    const head = root.querySelector('#fd-header');
    let sx=0, sy=0, ox=0, oy=0, dragging = false;
    function md(e){ dragging=true; sx=e.clientX; sy=e.clientY; const r=root.getBoundingClientRect(); ox=r.left; oy=r.top; document.body.style.userSelect='none'; }
    function mm(e){ if(!dragging) return; const nx = ox + (e.clientX-sx); const ny = oy + (e.clientY-sy); root.style.left = nx+'px'; root.style.top = ny+'px'; root.style.right='auto'; }
    function mu(){ if(!dragging) return; dragging=false; GM_setValue('fd_pos', {left:root.style.left, top:root.style.top}); document.body.style.userSelect=''; }
    head.addEventListener('mousedown', md);
    document.addEventListener('mousemove', mm);
    document.addEventListener('mouseup', mu);

    const pos = GM_getValue('fd_pos', null);
    if (pos) { root.style.left = pos.left; root.style.top = pos.top; root.style.right='auto'; }
  })();

  // Кнопки UI
  root.querySelector('#fd-save').onclick = () => {
    const val = root.querySelector('#fd-email').value.trim();
    GM_setValue('fp_email', val || DEFAULT_EMAIL);
    GM_setValue('fp_block_popups', POPUP_BLOCK);
    alert('✅ Сохранено');
  };
  root.querySelector('#fd-collapse').onclick = () => root.querySelector('#fd-header').click();

  const ghostBtn = root.querySelector('#fd-ghost');
  let ghost = false;
  ghostBtn.onclick = () => {
    ghost = !ghost;
    root.classList.toggle('fd-ghost', ghost);
    ghostBtn.textContent = ghost ? '👻 Призрак: ON' : '👻 Призрак: OFF';
  };

  const autoclickBtn = root.querySelector('#fd-autoclick');
  autoclickBtn.onclick = () => {
    const newVal = !(GM_getValue("fp_autoclick_after_solved", true));
    GM_setValue("fp_autoclick_after_solved", newVal);
    autoclickBtn.textContent = newVal ? 'AutoClaim: ON' : 'AutoClaim: OFF';
  };

  // Быстрые ссылки
  const linksWrap = root.querySelector('#fd-links');
  for (const f of FAUCETS) {
    const a = document.createElement('a');
    a.href = f.url(EMAIL);
    a.target = '_blank';
    a.className = 'fd-link';
    a.textContent = f.coin;
    linksWrap.appendChild(a);
  }

  // Открыть сайты
  root.querySelector('#fd-open-cfc').onclick = () => openGroup('claimfreecoins.io');
  root.querySelector('#fd-open-bee').onclick = () => openGroup('beefaucet.org');
  root.querySelector('#fd-open-all').onclick = () => openGroup();

  function openGroup(domain) {
    const mail = GM_getValue('fp_email', DEFAULT_EMAIL);
    FAUCETS.filter(f => !domain || f.d===domain)
      .forEach(f => GM_openInTab(f.url(mail), {active:false, setParent:true}));
  }

  // ------------------ HELPERS ------------------
  function qAll(sel){ return Array.from(document.querySelectorAll(sel)); }
  function containsText(el, ...subs){ const t=(el.textContent||'').toLowerCase(); return subs.some(s=>t.includes(s)); }
  function trigger(el, type){ try{ el.dispatchEvent(new Event(type,{bubbles:true})); }catch{} }

  // Найти и подсветить капчу
  function findCaptchaElements() {
    const list = [];
    // reCAPTCHA blocks
    qAll('.g-recaptcha,[data-sitekey]').forEach(e=>list.push(e));
    // iframes
    qAll('iframe').forEach(ifr=>{
      const src = (ifr.src||'').toLowerCase();
      if (src.includes('recaptcha') || src.includes('hcaptcha')) list.push(ifr);
    });
    return Array.from(new Set(list));
  }

  function focusCaptcha() {
    const els = findCaptchaElements();
    if (els.length === 0) {
      alert('Капча не найдена на странице');
      return;
    }
    els.forEach(e=>{
      e.classList.add('fd-outline');
      setTimeout(()=>e.classList.remove('fd-outline'), 4000);
    });
    try { els[0].scrollIntoView({behavior:'smooth', block:'center'}); } catch(_){}
    // Авто-«не мешать» при наличии капчи
    autoGhostOnCaptcha();
  }

  root.querySelector('#fd-focus-captcha').onclick = focusCaptcha;

  function autoGhostOnCaptcha() {
    if (findCaptchaElements().length>0) {
      // Авто-сворачивание + призрачный режим, чтобы не перекрывать
      bodyEl.style.display = 'none';
      toggleEl.textContent = '▸';
      root.classList.add('fd-ghost');
      setTimeout(()=> root.classList.remove('fd-ghost'), 20000); // через 20с вернём кликабельность
    }
  }

  // ------------------ PAGE LOGIC (вкладки кранов) ------------------
  const isFaucet = DOMAINS.some(d => location.hostname.includes(d));

  if (isFaucet) {
    // 1) Автозаполнение адреса
    const tryFill = () => {
      const mail = GM_getValue('fp_email', DEFAULT_EMAIL);
      const sels = ['#address','input[name="address"]','input[type="email"]','input[name="wallet"]'];
      for (const s of sels) {
        const el = document.querySelector(s);
        if (el && (!el.value || el.value.length < 4)) {
          el.value = mail;
          trigger(el,'input'); trigger(el,'change');
          break;
        }
      }
    };

    // 2) Поиск кнопки Claim
    function findClaimButton() {
      // приоритетные селекторы
      const priority = [
        'form button[type="submit"]',
        'button#claim','button#login','button#submit','button.btn-claim',
        'button.claim-button','#getReward','button.collect'
      ];
      for (const s of priority) {
        const el = document.querySelector(s);
        if (el) return el;
      }
      // fallback по тексту
      const candidates = qAll('button, input[type="submit"], a.btn, a.button');
      return candidates.find(el => containsText(el,'claim','get reward','collect','verify','continue')) || null;
    }

    // 3) Определение: капча решена?
    function captchaSolved() {
      // reCAPTCHA v2
      try {
        if (window.grecaptcha && typeof window.grecaptcha.getResponse === 'function') {
          const resp = window.grecaptcha.getResponse();
          if (resp && resp.length > 0) return true;
        }
      } catch(_){}
      // hCaptcha
      const hResp = document.querySelector('textarea[name="h-captcha-response"]');
      if (hResp && hResp.value && hResp.value.length>0) return true;

      // иногда сайты дублируют в скрытые поля
      const gResp = document.querySelector('textarea[name="g-recaptcha-response"]');
      if (gResp && gResp.value && gResp.value.length>0) return true;

      return false;
    }

    // 4) Авто-клик после решения капчи (без обхода)
    let clickedOnce = false;
    function tryAutoSubmit() {
      if (!GM_getValue("fp_autoclick_after_solved", true)) return;
      if (clickedOnce) return;
      const btn = findClaimButton();
      if (!btn) return;
      if (captchaSolved()) {
        trigger(btn,'mousedown'); trigger(btn,'mouseup');
        btn.click();
        clickedOnce = true;
      }
    }

    // 5) При наличии капчи не мешать и подсветить
    autoGhostOnCaptcha();
    setTimeout(focusCaptcha, 1200);

    // 6) Периодические действия
    setInterval(tryFill, 1500);
    setInterval(tryAutoSubmit, 1200);
  }

})();

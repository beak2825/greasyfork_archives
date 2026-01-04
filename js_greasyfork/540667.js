// ==UserScript==
// @name         Ghost Trade Helper - Max Deposit + Quick Buttons
// @namespace    https://www.torn.com/
// @version      4.20
// @description  Updated to be torn compliant!
// @author       swervelord
// @match        https://www.torn.com/trade.php*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/540667/Ghost%20Trade%20Helper%20-%20Max%20Deposit%20%2B%20Quick%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/540667/Ghost%20Trade%20Helper%20-%20Max%20Deposit%20%2B%20Quick%20Buttons.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const PRESET_BUTTONS = [
    ['-100k', -100_000],
    ['-500k', -500_000],
    ['-1m', -1_000_000],
    ['-5m', -5_000_000],
    ['-10m', -10_000_000],
    ['-100m', -100_000_000],
    ['-1b', -1_000_000_000],
  ];

  GM_addStyle(`
    .gth-btn {
      background: #2b2b2b !important;
      color: #fff !important;
      border: none !important;
      padding: 4px 10px !important;
      margin: 2px !important;
      font-weight: 600 !important;
      border-radius: 4px !important;
      box-shadow: 0 0 4px #00ffff80, 0 0 10px #00ffff40;
      cursor: pointer;
      transition: transform .12s, box-shadow .12s;
    }
    .gth-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 0 6px #00ffffb3, 0 0 14px #00ffff80;
    }
  `);

  const formatNumber = (n) => n.toLocaleString('en-US');
  const parseNumber = (str) => parseInt(str.replace(/[^0-9]/g, ''), 10) || 0;
  const getTradePageCash = () => {
    const el = document.querySelector('.money-value');
    return el ? parseInt(el.textContent.replace(/[^0-9]/g, ''), 10) : 0;
  };

  const waitForInput = () => new Promise((resolve) => {
    const check = () => {
      const inputs = document.querySelectorAll('.user-id.input-money');
      if (inputs.length === 2) return resolve(inputs);
      requestAnimationFrame(check);
    };
    check();
  });

  const insertButtons = (input, sync) => {
    if (document.querySelector('#ghost-trade-helper')) return;

    const container = document.createElement('div');
    container.id = 'ghost-trade-helper';
    container.style.marginTop = '10px';
    container.style.display = 'flex';
    container.style.flexWrap = 'wrap';

    PRESET_BUTTONS.forEach(([label, amount]) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'gth-btn';
      btn.textContent = label;
      btn.onclick = () => {
        const current = parseNumber(input.value);
        const newValue = Math.max(0, current + amount);
        input.value = formatNumber(newValue);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        sync();
      };
      container.appendChild(btn);
    });

    const custom = document.createElement('button');
    custom.type = 'button';
    custom.className = 'gth-btn';
    custom.textContent = 'Custom';
    custom.onclick = () => {
      const val = prompt('Enter amount to subtract:');
      if (!val) return;
      const current = parseNumber(input.value);
      const sub = parseNumber(val);
      const newValue = Math.max(0, current - sub);
      input.value = formatNumber(newValue);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      sync();
    };
    container.appendChild(custom);

    const paste = document.createElement('button');
    paste.type = 'button';
    paste.className = 'gth-btn';
    paste.textContent = 'Paste';
    paste.onclick = async () => {
      try {
        const text = await navigator.clipboard.readText();
        const newValue = parseNumber(text);
        input.value = formatNumber(newValue);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        sync();
      } catch {
        alert('Clipboard access denied.');
      }
    };
    container.appendChild(paste);

    input.parentElement.insertAdjacentElement('afterend', container);
  };

  const observeTradeCash = (input) => {
    let lastWallet = getTradePageCash();
    let lastInput = parseNumber(input.value);

    const sync = () => {
      lastWallet = getTradePageCash();
      lastInput = parseNumber(input.value);
    };

    const applyNewValue = () => {
      const newWallet = getTradePageCash();
      if (newWallet === lastWallet) return;
      const delta = lastInput - lastWallet;
      const newValue = Math.max(0, newWallet + delta);
      input.value = formatNumber(newValue);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      lastWallet = newWallet;
      lastInput = newValue;
    };

    const node = document.querySelector('.money-value');
    if (!node) return;

    const observer = new MutationObserver(applyNewValue);
    observer.observe(node, {
      childList: true,
      characterData: true,
      subtree: true,
    });

    setInterval(applyNewValue, 500);
    return sync;
  };

  const waitForLineBreakTarget = () => {
    const check = () => {
      const p = Array.from(document.querySelectorAll('p')).find(p =>
        p.textContent.includes('Enter in the amount of money you want to trade.') &&
        p.textContent.includes('You have $') &&
        !p.innerHTML.includes('<br>') &&
        !p.dataset.lineBreakFixed
      );

      if (p) {
        p.innerHTML = p.innerHTML.replace('. You have', '.<br>You have');
        p.dataset.lineBreakFixed = 'true';
      } else {
        requestAnimationFrame(check);
      }
    };

    requestAnimationFrame(check);
  };

  const startScript = async () => {
    const [input] = await waitForInput();

    const wallet = getTradePageCash();
    const current = parseNumber(input.value);
    input.value = formatNumber(wallet + current);
    input.dispatchEvent(new Event('input', { bubbles: true }));

    const sync = observeTradeCash(input);
    insertButtons(input, sync);
    sync();

    waitForLineBreakTarget();
  };

  const observer = new MutationObserver(() => {
    if (location.pathname === '/trade.php') {
      const input = document.querySelector('.user-id.input-money');
      if (input && !document.querySelector('#ghost-trade-helper')) {
        startScript();
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();

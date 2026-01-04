// ==UserScript==
// @name         PlayStation 顯示並複製 productId
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  在 PlayStation 網站的「訂閱/訂用」按鈕旁顯示 productId，並提供一鍵複製
// @author       shanlan(ChatGPT o3-mini)
// @match        *://*.playstation.com/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546921/PlayStation%20%E9%A1%AF%E7%A4%BA%E4%B8%A6%E8%A4%87%E8%A3%BD%20productId.user.js
// @updateURL https://update.greasyfork.org/scripts/546921/PlayStation%20%E9%A1%AF%E7%A4%BA%E4%B8%A6%E8%A4%87%E8%A3%BD%20productId.meta.js
// ==/UserScript==

(function () {
  const sel = 'button[data-telemetry-meta]';

  function parseMeta(el) {
    let raw = el.getAttribute('data-telemetry-meta') || '';
    try {
      return JSON.parse(raw);
    } catch (e1) {
      try {
        return JSON.parse(raw.replace(/&quot;/g, '"'));
      } catch (e2) {
        return null;
      }
    }
  }

  function isSubscribeCTA(btn, meta) {
    const dtc = btn.getAttribute('data-track-click') || '';
    const txt = (btn.textContent || '').trim();
    if (/subscribe/i.test(dtc)) return true;
    if (/訂閱|訂用|加入購物籃/.test(txt)) return true;
    if (meta && typeof meta.interactCta === 'string' && /subscribe|Add to Cart/i.test(meta.interactCta)) return true;
    return false;
  }

  function addLabel(btn) {
    if (btn.dataset.productIdLabelAttached) return;
    const meta = parseMeta(btn);
    if (!meta) return;
    if (!isSubscribeCTA(btn, meta)) return;

    const pid =
      meta.productId ||
      (Array.isArray(meta.productDetail) && meta.productDetail[0] && meta.productDetail[0].productId) ||
      '';

    if (!pid) return;

    const container = document.createElement('span');
    container.style.display = 'inline-flex';
    container.style.alignItems = 'center';
    container.style.gap = '6px';
    container.style.marginTop = '8px';
    container.style.padding = '2px';
    container.style.border = '1px solid rgba(128,128,128,0.35)';
    container.style.borderRadius = '4px';
    container.style.fontSize = '14px';
    container.style.lineHeight = '1.6';
    container.style.background = 'rgba(0,0,0,0.4)';
    container.style.color = 'inherit';

    const text = document.createElement('span');
    text.textContent = `${pid}`;

    const copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.textContent = '複製';
    copyBtn.style.cursor = 'pointer';
    copyBtn.style.padding = '2px 4px';
    copyBtn.style.fontSize = '14px';
    copyBtn.style.border = '1px solid rgba(128,128,128,0.35)';
    copyBtn.style.background = 'rgba(0,0,0,0.8)';
    copyBtn.style.borderRadius = '1px';

    copyBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const setDone = () => {
        const prev = copyBtn.textContent;
        copyBtn.textContent = '已複製';
        setTimeout(() => (copyBtn.textContent = prev), 1200);
      };
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(pid);
          setDone();
        } else {
          const ta = document.createElement('textarea');
          ta.value = pid;
          ta.style.position = 'fixed';
          ta.style.left = '-9999px';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          setDone();
        }
      } catch (err) {
        const ta = document.createElement('textarea');
        ta.value = pid;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        setDone();
      }
    });

    container.appendChild(text);
    container.appendChild(copyBtn);
    const ctaMain = btn.closest('[data-qa="mfeCtaMain"]');
      if (ctaMain) {
        if (!ctaMain.querySelector('.my-productid-label')) {
          container.classList.add('my-productid-label');
          ctaMain.appendChild(container);
      }
    } else {
      btn.insertAdjacentElement('afterend', container);
  }
    btn.dataset.productIdLabelAttached = '1';
  }

  function scan() {
    document.querySelectorAll(sel).forEach(addLabel);
  }

  const ready = () => {
    scan();
    const mo = new MutationObserver((muts) => {
      for (const m of muts) {
        for (const node of m.addedNodes) {
          if (!(node instanceof Element)) continue;
          if (node.matches && node.matches(sel)) addLabel(node);
          if (node.querySelectorAll) node.querySelectorAll(sel).forEach(addLabel);
        }
      }
    });
    mo.observe(document.documentElement || document.body, { childList: true, subtree: true });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready, { once: true });
  } else {
    ready();
  }
})();
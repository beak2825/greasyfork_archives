// ==UserScript==
// @name         facebook 短影音停用重播、解除靜音、增加可點擊的進度條
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  FB 短影音停用重播、解除靜音、增加可點擊的進度條
// @author       shanlan(ChatGPT o3-mini)
// @match        *://www.facebook.com/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538846/facebook%20%E7%9F%AD%E5%BD%B1%E9%9F%B3%E5%81%9C%E7%94%A8%E9%87%8D%E6%92%AD%E3%80%81%E8%A7%A3%E9%99%A4%E9%9D%9C%E9%9F%B3%E3%80%81%E5%A2%9E%E5%8A%A0%E5%8F%AF%E9%BB%9E%E6%93%8A%E7%9A%84%E9%80%B2%E5%BA%A6%E6%A2%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/538846/facebook%20%E7%9F%AD%E5%BD%B1%E9%9F%B3%E5%81%9C%E7%94%A8%E9%87%8D%E6%92%AD%E3%80%81%E8%A7%A3%E9%99%A4%E9%9D%9C%E9%9F%B3%E3%80%81%E5%A2%9E%E5%8A%A0%E5%8F%AF%E9%BB%9E%E6%93%8A%E7%9A%84%E9%80%B2%E5%BA%A6%E6%A2%9D.meta.js
// ==/UserScript==

(() => {
  const click = el => {
    if (!el?.dispatchEvent) return;
    const o = { bubbles: true, cancelable: true, composed: true };
    for (const [C, n] of [["PointerEvent","pointerdown"],["MouseEvent","mousedown"],["PointerEvent","pointerup"],["MouseEvent","mouseup"]]) {
      try { el.dispatchEvent(new (window[C] || MouseEvent)(n, o)); } catch {}
    }
    try { el.click(); } catch {}
  };

  const findBtn = v => {
    const q = "div[role='button'][aria-label*='取消靜音'],div[role='button'][aria-label*='Unmute'],div[role='button'][aria-label*='Turn on sound']";
    let r = v?.parentElement, i = 8;
    while (r && i--) { const b = r.querySelector(q); if (b) return b; r = r.parentElement; }
    return document.querySelector(q);
  };

  const autoUnmute = v => {
    if (v._umt) return;
    let t = 0;
    const tick = () => {
      if (v && !v.muted && (v.volume || 0) > 0) { clearInterval(v._umt); v._umt = null; return; }
      const b = findBtn(v); if (b) click(b);
      if (++t >= 12) { clearInterval(v._umt); v._umt = null; }
    };
    tick();
    v._umt = setInterval(tick, 500);
  };

  const addOverlay = v => {
    if (v._ov) return;
    const ov = document.createElement("div");
    ov.style.cssText = "position:fixed;background:transparent;z-index:1000000;pointer-events:auto;";
    const bar = document.createElement("div");
    bar.style.cssText = "height:100%;width:0;background:#f00;";
    ov.appendChild(bar);
    document.body.appendChild(ov);
    v._ov = ov;

    const pos = () => {
      const r = v.getBoundingClientRect();
      ov.style.left = r.left + "px";
      ov.style.top = (r.bottom - 8) + "px";
      ov.style.width = r.width + "px";
      ov.style.height = "8px";
      requestAnimationFrame(pos);
    };
    requestAnimationFrame(pos);

    v.addEventListener("timeupdate", () => {
      if (v.duration) bar.style.width = (v.currentTime / v.duration * 100) + "%";
    });

    ov.addEventListener("pointerdown", e => {
      e.preventDefault(); e.stopPropagation();
      const r = ov.getBoundingClientRect();
      const p = (e.clientX - r.left) / r.width;
      if (v.duration) v.currentTime = v.duration * p;
    }, { capture: true });
  };

  const enhance = v => {
    if (v._ok) return;
    v._ok = 1;
    v.loop = false;
    v.addEventListener("ended", () => { v.pause(); v.currentTime = v.duration; });
    const kick = () => autoUnmute(v);
    ["canplay","play","loadedmetadata"].forEach(e => v.addEventListener(e, kick, { once: true }));
    kick();
    addOverlay(v);
  };

  const scan = n => {
    if (!n) return;
    n.nodeName === "VIDEO" ? enhance(n) : n.querySelectorAll?.("video").forEach(enhance);
  };

  new MutationObserver(m => m.forEach(x => x.addedNodes.forEach(scan)))
    .observe(document.body, { childList: true, subtree: true });

  document.querySelectorAll("video").forEach(enhance);
})();
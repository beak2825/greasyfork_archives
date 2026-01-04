// ==UserScript==
// @name         chatgpt burrito
// @namespace    https://spin.rip/
// @match        https://chatgpt.com/*
// @grant        none
// @version      1.1.1
// @author       Spinfal
// @description  makes chatgpt pretty
// @license      AGPL-3.0
// @run-at       document-start
// @icon         https://help.openai.com/favicon.png
// @downloadURL https://update.greasyfork.org/scripts/545908/chatgpt%20burrito.user.js
// @updateURL https://update.greasyfork.org/scripts/545908/chatgpt%20burrito.meta.js
// ==/UserScript==

(function () {
  /*
   * official image from the chatgpt 5 launch.
   * in the case that this image no longer loads, you can switch to: https://cdn.spin.rip/r/1920.webp
   *
   * or you can use your own image
  */
  const imageUrl = 'https://persistent.oaistatic.com/burrito-nux/1920.webp';
  const navHeaderImageUrl = 'https://cdn.spin.rip/r/diagrainbow.png';
  const hideContent = false;

  const css = `
    /* let bg show through */
    html, body { background: transparent !important; }
    body { position: relative !important; min-height: 100vh !important; }

    /* dimmed + blurred page backdrop */
    body::before {
      content: '' !important;
      position: fixed !important;
      inset: 0 !important;
      background: url("${imageUrl}") center/cover no-repeat !important;
      filter: brightness(0.25) blur(90px) !important;
      transform: scale(1.03) !important;
      pointer-events: none !important;
      z-index: -1 !important;
    }

    /* kill the growing fade at the bottom area */
    #thread-bottom-container.content-fade::before,
    #thread-bottom-container.content-fade::after,
    #thread-bottom-container .vertical-scroll-fade-mask::before,
    #thread-bottom-container .vertical-scroll-fade-mask::after,
    #thread-bottom-container .horizontal-scroll-fade-mask::before,
    #thread-bottom-container .horizontal-scroll-fade-mask::after {
      content: none !important;
      display: none !important;
    }
    #thread-bottom-container.content-fade,
    #thread-bottom-container .vertical-scroll-fade-mask,
    #thread-bottom-container .horizontal-scroll-fade-mask {
      -webkit-mask: none !important;
      mask: none !important;
      -webkit-mask-image: none !important;
      mask-image: none !important;
      background-image: none !important;
      box-shadow: none !important;
    }

    /* ---- glass composer ---- */
    .spin-glass-composer {
      background: rgba(18,18,18,0.35) !important;
      -webkit-backdrop-filter: blur(16px) saturate(120%);
              backdrop-filter: blur(16px) saturate(120%);
      border: 1px solid rgba(255,255,255,0.12) !important;
      box-shadow: 0 10px 30px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.10);
      position: relative !important;
      overflow: visible !important;
      z-index: 1;
      transition: box-shadow .2s ease, transform .2s ease;
    }
    .spin-glass-composer:hover {
      box-shadow: 0 14px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.12);
      transform: translateY(-1px);
    }
    .spin-glass-composer::before {
      content: '';
      position: absolute; inset: 0;
      border-radius: inherit;
      pointer-events: none;
      box-shadow: inset 0 0 0 1px rgba(255,255,255,0.06);
    }
    .spin-glass-composer:focus-within::after {
      content: '';
      position: absolute; inset: -6px;
      border-radius: inherit;
      pointer-events: none;
      box-shadow: 0 0 30px rgba(123,220,255,0.12);
    }

    /* moving border highlight that follows nearest edge to cursor */
    .spin-glow-ring {
      position: absolute;
      inset: 0;
      padding: 2px;
      border-radius: inherit;
      pointer-events: none;
      --glow-color: rgba(255, 255, 255, 0.60);
      --mx: 50%;
      --my: 50%;
      --glow-o: 0;
      background: radial-gradient(160px 160px at var(--mx) var(--my), var(--glow-color) 0, rgba(123, 220, 255, 0) 70%);
      filter: drop-shadow(0 0 10px var(--glow-color)) drop-shadow(0 0 18px var(--glow-color));
      opacity: var(--glow-o);
      transition: opacity .18s ease-out;
      -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
    }

    /* soft ambient when focused */
    .spin-glass-composer:focus-within::after {
      content: '';
      position: absolute;
      inset: -6px;
      border-radius: inherit;
      pointer-events: none;
      box-shadow: 0 0 30px rgba(123, 220, 255, 0.12);
    }

    /* navbar, top section, and profile button */
    #stage-slideover-sidebar nav::before {
      content: "";
      position: absolute;
      inset: 0;
      background: url("${imageUrl}") center/cover no-repeat;
      filter: blur(90px) brightness(0.25); /* only applies to the pseudo-element image */
      z-index: -1;
    }

    #stage-slideover-sidebar nav {
      position: relative; /* anchor the pseudo-element */
      isolation: isolate; /* make z-index work as intended */
    }

    #stage-slideover-sidebar {
      isolation: isolate;
      background-color: rgba(30,30,30,0.35) !important; /* needs some alpha for backdrop-filter */
      -webkit-backdrop-filter: blur(18px) saturate(120%);
              backdrop-filter: blur(18px) saturate(120%);
      border-right: 1px solid rgba(255,255,255,0.08)!important;
      box-shadow: 6px 0 24px rgba(0,0,0,0.35), inset -1px 0 0 rgba(255,255,255,0.04);
    }

    [aria-label="Chat history"] > div:first-of-type {
      background: url("${navHeaderImageUrl}") center/cover no-repeat;
    }

    /* first aside inside the nav */
    #stage-slideover-sidebar nav > aside:first-of-type {
      position: sticky; /* make sure it actually overlays */
      z-index: 2;
      isolation: isolate;
      background-color: rgba(15,15,15,0.25) !important;
      -webkit-backdrop-filter:blur(24px) saturate(120%);
              backdrop-filter:blur(24px) saturate(120%);
    }

    /* bottom profile strip container (stronger blur) */
    #stage-slideover-sidebar .sticky.bottom-0.z-30 {
      isolation: isolate;
      background-color: rgba(15,15,15,0.25) !important;
      -webkit-backdrop-filter: blur(32px) saturate(120%);
              backdrop-filter: blur(32px) saturate(120%);
    }

    ${hideContent ? `
    /* HIDES YOUR PROFILE, PROJECTS, AND HISTORY HIDDEN - use the hideContent var at the top of this script */
    #history, #snorlax-heading {
      filter: blur(15px);
    }

    #history:hover, #snorlax-heading:hover {
      filter: blur(0px);
    }

    #stage-slideover-sidebar .sticky.bottom-0.z-30 {
      filter: blur(5px);
    }

    #stage-slideover-sidebar .sticky.bottom-0.z-30:hover {
      filter: blur(0px);
    }
    ` : ''}

    /* prompt suggestions */
    #thread-bottom ul {
      margin-top: 10px;
    }

    #thread-bottom ul li > button {
      background-color: rgba(15,15,15,.25) !important;
      -webkit-backdrop-filter: blur(32px) saturate(120%);
      backdrop-filter: blur(32px) saturate(120%);
      margin-bottom: 5px;
    }

    #thread-bottom ul li > .bg-token-border-default,
    #thread-bottom ul li > .bg-token-main-surface-secondary {
      background-color: transparent !important;
    }
  `;

  const style = document.createElement('style');
  style.id = '__spin_bg_style';
  style.textContent = css;
  (document.head || document.documentElement).appendChild(style);

  const mo = new MutationObserver(() => {
    if (!document.getElementById('__spin_bg_style')) {
      (document.head || document.documentElement).appendChild(style);
    }
  });
  mo.observe(document.documentElement, { childList: true, subtree: true });

  /* find the composer "shell" without hard-coding a utility class */
  function findComposerShell(form) {
    if (!form) return null;
    // new grid container with overflow-clip
    let shell = form.querySelector('div.overflow-clip.grid');
    if (shell) return shell;
    // fallback: anything overflow-clip + rounded
    shell = form.querySelector('div.overflow-clip[class*="rounded"]');
    if (shell) return shell;
    // last resort: biggest div containing editor/send
    const candidates = [...form.querySelectorAll('div')]
      .filter(d => d.querySelector('[contenteditable="true"], textarea, [data-testid="send-button"]'))
      .sort((a, b) => b.getBoundingClientRect().width - a.getBoundingClientRect().width);
    return candidates[0] || null;
  }

  function enhanceComposer(root = document) {
    // be loose about the form selector in case temporary chat swaps attributes
    const forms = root.querySelectorAll(
      'form[data-type="unified-composer"], form:has([contenteditable="true"]), form:has(textarea)'
    );
    forms.forEach(form => {
      const shell = findComposerShell(form);
      if (!shell) {
        if (!form.__spinWarned) {
          console.warn('[spin burrito] composer shell not found; selectors may need an update');
          form.__spinWarned = true;
        }
        return;
      }
      if (shell.classList.contains('spin-glass-composer')) return;
      shell.classList.add('spin-glass-composer');
      const ring = document.createElement('div');
      ring.className = 'spin-glow-ring';
      shell.prepend(ring);
    });
  }

  /* attach frosted class to the sidebar container or the nav itself */
  function enhanceNav(root = document) {
    const nav = root.querySelector('nav[aria-label="Chat history"]');
    if (!nav) return;
    const container =
      document.getElementById('stage-slideover-sidebar') ||
      nav.closest('[id*="sidebar"], [data-testid*="sidebar"], aside') ||
      null;

    if (container && !container.classList.contains('spin-glass-sidebar')) {
      container.classList.add('spin-glass-sidebar');
    }
    if (!nav.classList.contains('spin-glass-nav')) {
      nav.classList.add('spin-glass-nav');
    }
  }

  // retrigger enhance when the temporary chat toggle is clicked
  function hookTempChatToggle(root = document) {
    const btn = root.querySelector('button[aria-label="Turn on temporary chat"], button[aria-label="Turn off temporary chat"]');
    if (!btn || btn.__spinHooked) return;
    btn.__spinHooked = true;
    btn.addEventListener('click', () => {
      // next frame and shortly after to cover async re-render
      requestAnimationFrame(() => enhanceAllSoon());
      setTimeout(() => enhanceAllSoon(), 120);
    }, { passive: true });
  }

  const PROXIMITY = 140; // px
  function onPointerMove(e) {
    document.querySelectorAll('.spin-glass-composer').forEach(el => {
      const ring = el.querySelector(':scope > .spin-glow-ring');
      if (!ring) return;
      const r = el.getBoundingClientRect();
      const px = Math.max(r.left, Math.min(e.clientX, r.right));
      const py = Math.max(r.top,  Math.min(e.clientY, r.bottom));
      const dx = e.clientX < r.left ? r.left - e.clientX : e.clientX > r.right ? e.clientX - r.right : 0;
      const dy = e.clientY < r.top ? r.top - e.clientY : e.clientY > r.bottom ? e.clientY - r.bottom : 0;
      const dist = Math.hypot(dx, dy);
      const mx = ((px - r.left) / r.width) * 100;
      const my = ((py - r.top)  / r.height) * 100;
      const o  = Math.max(0, 1 - dist / PROXIMITY);
      ring.style.setProperty('--mx', `${mx}%`);
      ring.style.setProperty('--my', `${my}%`);
      ring.style.setProperty('--glow-o', o > 0 ? (0.25 + 0.75 * o) : 0);
    });
  }

  function streamingTextChecker() {
    const DURATION_MS = 1000; // full sweep left→right
    const EDGE_PAD = 4; // avoid clipping at edges
    const OVERTRAVEL = 10; // percent beyond each edge for smoother fade
    const STYLE_ID = 'spin-glow-override';
    const SAFETY_INTERVAL_MS = 2000; // very light fallback check

    // inject a hard override so hover/distance css can't kill opacity
    // this sets the custom property itself with !important
    if (!document.getElementById(STYLE_ID)) {
      const s = document.createElement('style');
      s.id = STYLE_ID;
      s.textContent = `
        /* keep the ring visible any time streaming-animation is present in the ancestor chain */
        :where(.streaming-animation) .spin-glow-ring { --glow-o: 1 !important; opacity: 1 !important; }
      `;
      document.head.appendChild(s);
    }

    let glowEl = document.querySelector('.spin-glow-ring');
    let running = false;
    let rafId = null;
    let startTime = 0;
    let prevPresent = null;

    const tick = t => {
      if (!running) return;
      if (!startTime) startTime = t;
      const elapsed = (t - startTime) % DURATION_MS;
      const pct = elapsed / DURATION_MS;
      const travel = 100 + OVERTRAVEL * 2;
      const x = -OVERTRAVEL + pct * travel;
      if (glowEl) {
        glowEl.style.setProperty('--mx', x.toFixed(2) + '%');
        glowEl.style.setProperty('--my', '50%');
        glowEl.style.setProperty('--glow-o', '1'); // keep forcing full opacity while streaming
        glowEl.style.opacity = '1'; // belt and suspenders in case the css var isn't used
      }
      rafId = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running) return;
      running = true;
      if (glowEl) {
        glowEl.style.setProperty('--glow-o', '1');
        glowEl.style.opacity = '1';
      }
      startTime = 0;
      rafId = requestAnimationFrame(tick);
    };

    const stop = () => {
      if (!running) return;
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
      if (glowEl) {
        glowEl.style.removeProperty('--glow-o'); // let normal behavior resume when not streaming
        glowEl.style.removeProperty('opacity');
      }
    };

    // re-evaluate whether we should run
    const reevaluate = () => {
      if (!glowEl || !glowEl.isConnected) glowEl = document.querySelector('.spin-glow-ring');
      const hasRing = !!glowEl && glowEl.isConnected;
      const present = !!document.querySelector('.streaming-animation');
      if (!hasRing) { stop(); prevPresent = present; return; }
      if (present === prevPresent) return;
      prevPresent = present;
      present ? start() : stop();
    };

    // avoid double observers if user calls this twice
    if (!window.__spinGlowObserver) {
      const mo = new MutationObserver(muts => {
        for (const m of muts) {
          if (m.type === 'attributes') {
            if (m.attributeName === 'class') { reevaluate(); return; }
          } else {
            for (const n of m.addedNodes) {
              if (!(n instanceof Element)) continue;
              if (n.matches?.('.spin-glow-ring, .streaming-animation') || n.querySelector?.('.spin-glow-ring, .streaming-animation')) { reevaluate(); return; }
            }
            for (const n of m.removedNodes) {
              if (!(n instanceof Element)) continue;
              if (n === glowEl || n.matches?.('.streaming-animation') || n.querySelector?.('.streaming-animation')) { reevaluate(); return; }
            }
          }
        }
      });
      mo.observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['class'] });
      window.__spinGlowObserver = mo;
    }

    // safety net in case some dom changes slip past
    if (!window.__spinGlowSafetyInterval) {
      window.__spinGlowSafetyInterval = setInterval(reevaluate, SAFETY_INTERVAL_MS);
    }

    // initial check
    reevaluate();
  }

  const ready = () => { enhanceComposer(); enhanceNav(); };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready, { once: true });
  } else {
    ready();
  }

  // tiny debounce helper
  function debounce(fn, wait) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(null, args), wait);
    };
  }

  const enhanceAllSoon = debounce(() => {
    enhanceComposer(document);
    enhanceNav(document);
  }, 50);

  const mo2 = new MutationObserver(muts => {
    let shouldEnhance = false;
    for (const m of muts) {
      if (m.type !== 'childList') continue;
      for (const n of m.addedNodes) {
        if (n.nodeType !== 1) continue; // element only
        // case 1: a new form got added
        if (n.matches?.('form[data-type="unified-composer"], form:has([contenteditable="true"]), form:has(textarea)')) {
          shouldEnhance = true;
          continue;
        }
        // case 2: a new shell got added inside an existing form
        const form = n.closest?.('form[data-type="unified-composer"], form:has([contenteditable="true"]), form:has(textarea)');
        if (form) { shouldEnhance = true; continue; }
        // case 3: chat history/nav bits appeared
        if (n.matches?.('nav[aria-label="Chat history"]') || n.querySelector?.('nav[aria-label="Chat history"]')) {
          shouldEnhance = true; continue;
        }
      }
    }
    if (shouldEnhance) enhanceAllSoon();
  });
  mo2.observe(document.documentElement, { childList: true, subtree: true });

  const mo3 = new MutationObserver(() => hookTempChatToggle());
  mo3.observe(document.documentElement, { childList: true, subtree: true });

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('beforeunload', () => {
    mo.disconnect(); mo2.disconnect();
    window.removeEventListener('pointermove', onPointerMove);
  });
  window.onload = () => {
    streamingTextChecker();
    hookTempChatToggle();
  }
})();
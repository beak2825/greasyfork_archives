// ==UserScript==
// @name         Hide OLX Promoted Ads
// @name:ro      Ascunde Anunțuri De Tip PROMOVAT Pe OLX
// @name:bg      Скриване На Реклами Тип ПРОМОТИРАНА ОБЯВА На OLX
// @name:ua      Приховати Оголошення Типу ТОП На OLX
// @name:pt      Ocultar Anúncios Do Tipo TOP No OLX
// @name:pl      Ukryj Ogłoszenia Typu WYRÓŻNIONE Na OLX
// @description  It hides all promoted ads on OLX
// @description:ro Ascunde toate anunțurile de tip PROMOVAT de pe OLX
// @description:bg Скрива всички реклами тип ПРОМОТИРАНА ОБЯВА на OLX
// @description:ua Сховує всі оголошення типу ТОП на OLX
// @description:pt Oculta todos os anúncios do tipo TOP no OLX
// @description:pl Ukrywa wszystkie ogłoszenia typu WYRÓŻNIONE na OLX
// @author       NWP
// @namespace    https://greasyfork.org/users/877912
// @version      1.0
// @license      MIT
// @match        *://www.olx.ro/*
// @match        *://www.olx.bg/*
// @match        *://www.olx.ua/*
// @match        *://www.olx.pt/*
// @match        *://www.olx.pl/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/542859/Hide%20OLX%20Promoted%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/542859/Hide%20OLX%20Promoted%20Ads.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const DEBUG = false;

  const CARD_SELECTOR = '[data-cy="l-card"][data-testid="l-card"]';
  const HIDE_CLASS = "nwp-hide-painted-canvas";

  // Retry timings (ms). OLX may paint the canvas slightly after insertion / when visible.
  const RETRY_DELAYS = [0, 150, 350, 700, 1200, 2000];
  const MAX_TRIES = RETRY_DELAYS.length;

  // Track state per card without leaking memory
  const state = new WeakMap(); // card -> { tries, done }

  function log(...args) {
    if (DEBUG) console.log("[OLX canvas hide]", ...args);
  }

  function injectCSS() {
    if (document.getElementById("nwp-canvas-hide-style")) return;
    const style = document.createElement("style");
    style.id = "nwp-canvas-hide-style";
    style.textContent = `
      .${HIDE_CLASS} { display: none !important; }
    `;
    document.documentElement.appendChild(style);
  }

  function canvasHasPixels(canvas) {
    try {
      const ctx = canvas.getContext("2d");
      if (!ctx) return false;
      const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
      for (let i = 3; i < data.length; i += 4) {
        if (data[i] !== 0) return true; // alpha != 0 => something drawn
      }
      return false;
    } catch (e) {
      // If OLX ever taints the canvas (SecurityError), we can’t read pixels.
      // In that case, DON'T hide based on pixels (safer).
      log("getImageData failed (tainted canvas?)", e);
      return false;
    }
  }

  function getBadgeCanvas(card) {
    // Be flexible: OLX structure/classes can change. Any canvas inside card.
    return card.querySelector("canvas");
  }

  function hideCard(card) {
    if (!card.classList.contains(HIDE_CLASS)) {
      card.classList.add(HIDE_CLASS);
      log("Hiding (painted canvas):", card.id || "(no-id)");
    }
  }

  function showCard(card) {
    if (card.classList.contains(HIDE_CLASS)) {
      card.classList.remove(HIDE_CLASS);
      log("Showing (not painted):", card.id || "(no-id)");
    }
  }

  function evaluateCard(card) {
    const canvas = getBadgeCanvas(card);
    if (!canvas) {
      // No canvas? Keep it visible.
      showCard(card);
      return { painted: false, hasCanvas: false };
    }
    const painted = canvasHasPixels(canvas);
    if (painted) hideCard(card);
    else showCard(card);
    return { painted, hasCanvas: true };
  }

  function scheduleChecks(card) {
    if (!card || !card.isConnected) return;

    let s = state.get(card);
    if (s?.done) return;

    if (!s) {
      s = { tries: 0, done: false };
      state.set(card, s);
    }

    const attempt = () => {
      if (!card.isConnected) return;
      const st = state.get(card);
      if (!st || st.done) return;

      const { painted } = evaluateCard(card);

      st.tries += 1;

      // If painted => hide and stop (final)
      if (painted) {
        st.done = true;
        return;
      }

      // Not painted yet: keep retrying a few times (it may get painted later)
      if (st.tries < MAX_TRIES) {
        setTimeout(attempt, RETRY_DELAYS[st.tries]);
      } else {
        // After retries, accept as "not promoted" and stop.
        st.done = true;
      }
    };

    // Start immediately (or at first delay)
    setTimeout(attempt, RETRY_DELAYS[Math.min(s.tries, MAX_TRIES - 1)]);
  }

  function processExisting() {
    document.querySelectorAll(CARD_SELECTOR).forEach(scheduleChecks);
  }

  // Observe new cards being added to the DOM
  function setupMutationObserver() {
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (!(node instanceof Element)) continue;

          if (node.matches?.(CARD_SELECTOR)) {
            scheduleChecks(node);
          } else {
            node.querySelectorAll?.(CARD_SELECTOR).forEach(scheduleChecks);
          }
        }
      }
    });

    mo.observe(document.body, { childList: true, subtree: true });
  }

  // Re-check when card becomes visible (lazy painting often happens on enter viewport)
  function setupIntersectionObserver() {
    if (!("IntersectionObserver" in window)) return null;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const card = entry.target;
          const st = state.get(card);
          // If we previously marked done=false or even done=true as not painted,
          // give it another chance when it becomes visible:
          if (!st || !st.done) {
            scheduleChecks(card);
          } else {
            // If done=true but it was "not painted", you can still re-check once
            // when visible by uncommenting next line:
            // scheduleChecks(card);
          }
        }
      },
      { root: null, threshold: 0.05 }
    );

    // Attach to current + future cards
    document.querySelectorAll(CARD_SELECTOR).forEach((c) => io.observe(c));

    // Also observe newly added cards and attach IO via mutation observer hook:
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (!(node instanceof Element)) continue;
          if (node.matches?.(CARD_SELECTOR)) io.observe(node);
          node.querySelectorAll?.(CARD_SELECTOR).forEach((c) => io.observe(c));
        }
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return io;
  }

  function start() {
    injectCSS();
    processExisting();
    setupMutationObserver();
    setupIntersectionObserver();
    log("Started");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
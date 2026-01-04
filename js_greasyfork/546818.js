// ==UserScript==
// @name         CHZZK  Ad Block Auto Quality Change
// @version      1.0.8
// @match        https://chzzk.naver.com/*
// @description  치지직 광고 차단 감지 스크립트를 우회합니다.
// @run-at       document-start
// @grant        none
// @author       k22pr
// @namespace    k22pr/chzzk-ad-block-auto-quality-change
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/546818/CHZZK%20%20Ad%20Block%20Auto%20Quality%20Change.user.js
// @updateURL https://update.greasyfork.org/scripts/546818/CHZZK%20%20Ad%20Block%20Auto%20Quality%20Change.meta.js
// ==/UserScript==

console.log("auto-quality.js");
(function () {
  const VIDEO_ELEMENT_NAME = "video.webplayer-internal-video";
  const QUALITY_ELEMENT_NAME = "li.pzp-ui-setting-quality-item";

  let qualityInterval = null;
  let processed = false;

  function pressEnterOnElement(el) {
    if (!el) return;
    el.focus?.({ preventScroll: true });
    el.click();
    el.dispatchEvent(
      new KeyboardEvent("keydown", {
        bubbles: true,
        key: "Enter",
        code: "Enter",
      })
    );
    el.dispatchEvent(
      new KeyboardEvent("keyup", { bubbles: true, key: "Enter", code: "Enter" })
    );
  }

  async function tick() {
    await new Promise((r) =>
      requestAnimationFrame(() => requestAnimationFrame(r))
    );
    const hasLive = location.pathname.includes("/live/");
    const videoEl = document.querySelector(VIDEO_ELEMENT_NAME);
    const items = [
      ...new Set([...document.querySelectorAll(QUALITY_ELEMENT_NAME)]),
    ];
    const target = items.find((li) => /1080p|720p/.test(li.innerText));
    if (!target) return false;

    const isNowHighQuality =
      target?.classList.contains("pzp-ui-setting-pane-item--checked") ?? false;

    if (hasLive && !isNowHighQuality && !processed) {
      pressEnterOnElement(target);
      videoEl.play().catch(() => {});
      processed = true;
      return;
    }

    if (isNowHighQuality && videoEl && !videoEl.paused) {
      stopQualityInterval();
    }
  }

  function startQualityInterval() {
    if (qualityInterval !== null) return;
    qualityInterval = setInterval(tick, 100);
  }

  function stopQualityInterval() {
    if (qualityInterval === null) return;
    clearInterval(qualityInterval);
    qualityInterval = null;
  }

  function restartQualityInterval() {
    processed = false;
    stopQualityInterval();
    startQualityInterval();
    setTimeout(stopQualityInterval, 3000);
  }

  // test: Alt+H
  window.addEventListener("keydown", (e) => {
    if (e.altKey && e.key.toLowerCase() === "h") pressEnterOnElement();
  });

  function tryMount() {
    const videoElement = document.querySelector(VIDEO_ELEMENT_NAME);

    videoElement?.addEventListener("loadedmetadata", () => {
      tick();
      restartQualityInterval();
    });
  }

  (function () {
    const fireLoc = () => setTimeout(restartQualityInterval, 0);
    const _ps = history.pushState,
      _rs = history.replaceState;
    history.pushState = function () {
      const r = _ps.apply(this, arguments);
      fireLoc();
      return r;
    };
    history.replaceState = function () {
      const r = _rs.apply(this, arguments);
      fireLoc();
      return r;
    };
    window.addEventListener("popstate", fireLoc);
  })();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", tryMount, { once: true });
  } else {
    tryMount();
  }

  new MutationObserver((list) => {
    for (const m of list) {
      for (const n of m.addedNodes) {
        if (n.nodeType !== 1) continue;
        if (
          n.matches?.(VIDEO_ELEMENT_NAME) ||
          n.querySelector?.(VIDEO_ELEMENT_NAME)
        )
          tryMount();
      }
    }
  }).observe(document.documentElement, { childList: true, subtree: true });
})();

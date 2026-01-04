// ==UserScript==
// @name         Refresh Unavailable
// @version      0.0.4
// @author       Me
// @namespace    http://tampermonkey.net/
// @description  nothing
// @match        https://*.duolingo.com/*
// @grant        none
// @run-at      document-start
// @license      MIT
// @copyright   2025.06
// @downloadURL https://update.greasyfork.org/scripts/546109/Refresh%20Unavailable.user.js
// @updateURL https://update.greasyfork.org/scripts/546109/Refresh%20Unavailable.meta.js
// ==/UserScript==
(function () {
  "use strict";

  /************ CONFIGURATION ************/
  const DEFAULT_OK_S = 10; // reload when all is OK
  const NO_NET_DELAY_S = 10; // reload after 10s if no XHR/fetch
  const OBSERVE_WINDOW_S = 2; // wait this long for activity
  const HARD_ERR_S = 30; // reload for 503/502/Cloudflare
  const DNS_ERR_S = 15; // reload for DNS error
  const MAX_STAY_SECONDS = 30; // failsafe: reload no matter what
  const INTERACTION_EVENTS = ["click","keydown","mousemove","scroll","touchstart"];
  /****************************************/

  /* ------------ utilities ------------- */

  function forceReload() {
    window.onbeforeunload = null;
    location.href = location.href;
  }

  /** badge in corner */
  function setBadge(txt) {
    let div = document.getElementById("autorefresh-badge");
    if (!div) {
      div = document.createElement("div");
      div.id = "autorefresh-badge";
      Object.assign(div.style, {
        position: "fixed", top: "8px", right: "8px", zIndex: 99999,
        padding: "4px 8px", background: "rgba(0,0,0,.7)", color: "#fff",
        font: "14px/1 sans-serif", borderRadius: "4px"
      });
      document.body.appendChild(div);
    }
    div.textContent = txt;
  }

  /* ------------ countdown core ------------- */

  let countdownId = null;
  let secondsLeft = 0;

  function startCountdown(sec, label) {
    clearCountdown();
    secondsLeft = sec;
    tick(label);
    countdownId = setInterval(() => tick(label), 1_000);
  }

  function tick(label) {
    if (secondsLeft <= 0) { clearCountdown(); forceReload(); return; }
    setBadge(`${label}：${secondsLeft--} 秒…`);
  }

  function clearCountdown() {
    if (countdownId) clearInterval(countdownId);
    countdownId = null;
    document.getElementById("autorefresh-badge")?.remove();
  }

  /* ------------ hard error detection ------------- */

  function detectHardError() {
    const t = document.title;
    if (
      t.includes("找不到伺服器") || t.includes("Server Not Found") ||
      t.includes("This site can") || t.includes("無法連上伺服器") ||
      t.includes("Safari 無法開啟網頁")
    ) return { type: "dns", delay: DNS_ERR_S };

    if (
      t.includes("503") || t.includes("502") ||
      document.querySelector(".cf-error-type") ||
      document.querySelector("h1")?.textContent.includes("Bad Gateway")
    ) return { type: "hard", delay: HARD_ERR_S };

    return null;
  }

  /* ------------ network activity monitor ------------- */

  let networkSeen = false;

  function noteNetworkActivity() { networkSeen = true; }

  function instrumentNetwork() {
    if (window.fetch) {
      const origFetch = window.fetch;
      window.fetch = function (...args) {
        noteNetworkActivity();
        return origFetch.apply(this, args);
      };
    }
    const origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (...args) {
      this.addEventListener("loadstart", noteNetworkActivity, { once: true });
      return origOpen.apply(this, args);
    };
  }

  /* ------------ user interaction keeps 3s countdown alive ------------- */

  function attachInteractionReset() {
    INTERACTION_EVENTS.forEach(ev =>
      window.addEventListener(ev, () => {
        if (countdownId && secondsLeft <= DEFAULT_OK_S) {
          startCountdown(DEFAULT_OK_S, "重新整理");
        }
      }, { passive: true })
    );
  }

  /* ------------ 30-second failsafe timer ------------- */

  function startFailsafe() {
    setTimeout(() => {
      console.log("⏳ Max stay time reached → force reload");
      setBadge("停留超過 30 秒，重新整理…");
      setTimeout(forceReload, 2000); // 2s for badge to show
    }, MAX_STAY_SECONDS * 1000);
  }

  /* ------------ main logic ------------- */

  function ready() {
    startFailsafe(); // <-- always active

    const hard = detectHardError();
    if (hard) {
      console.log(`🔴 Error: ${hard.type} → reload in ${hard.delay}s`);
      startCountdown(hard.delay, "錯誤，將重新整理");
      return;
    }

    instrumentNetwork();

    setTimeout(() => {
      if (!networkSeen) {
        console.log("🟡 No XHR/fetch seen → 10s reload");
        startCountdown(NO_NET_DELAY_S, "無網路活動，將重新整理");
      } else {
        console.log("🟢 Network seen → 3s timer with reset on activity");
        startCountdown(DEFAULT_OK_S, "重新整理");
        attachInteractionReset();
      }
    }, OBSERVE_WINDOW_S * 1000);
  }

  document.addEventListener("DOMContentLoaded", ready);
})();


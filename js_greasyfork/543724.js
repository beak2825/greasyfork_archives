// ==UserScript==
// @name         ChatGPT AutoCleaner v5
// @version      1.5
// @description  Bugfix & speed-up for ChatGPT: cleans the conversation chat window by trimming old messages from the Browser DOM. Keeps only the latest N turns visible, preventing lag and excessive DOM size on long sessions. Includes manual “Clean now” button and auto-clean toggle.
// @author       Aleksey Maximov <amaxcz@gmail.com>
// @match        https://chat.openai.com/*
// @match        https://chatgpt.com/*
// @grant        none
// @namespace    81e29c9d-b6e3-4210-b862-c93cb160f09a
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543724/ChatGPT%20AutoCleaner%20v5.user.js
// @updateURL https://update.greasyfork.org/scripts/543724/ChatGPT%20AutoCleaner%20v5.meta.js
// ==/UserScript==



/*
WHY THIS FIX EXISTS (read this once):

Problem:
- The ChatGPT web app keeps adding conversation turns to the DOM indefinitely.
- On long sessions the DOM grows huge → reflows/repaints become expensive → UI lags.
- React also keeps its own internal arrays with messages, drafts, telemetry and other
  data that never gets freed properly. This is a major source of memory bloat, but
  the safe way to clean it without breaking features is still unclear.

What this script changes:
- On a timer, it trims old DOM turns (visual cleanup only).
- Adds a **Clean now** button to trigger immediate trim.
- Auto-clean can be enabled/disabled, and interval/keep count adjusted.
- Skips auto-clean when the tab is hidden.

Result:
- Only the latest N messages remain in the DOM.
- Old nodes are removed → browser memory/paint workload drops.
- React’s hidden memory leaks still remain, but DOM cleanup alone already makes
  long sessions much smoother. Further fixes are TBD.
*/


(function () {
  'use strict';

  // ---------- UI ----------
  function injectUI() {
    if (document.getElementById("chatgpt-cleaner-panel")) return;

    const defaults = { leaveOnly: 5, intervalSec: 10, enabled: false };
    const stored = {
      leaveOnly: parseInt(localStorage.getItem("chatgpt-leaveOnly")) || defaults.leaveOnly,
      intervalSec: parseInt(localStorage.getItem("chatgpt-intervalSec")) || defaults.intervalSec,
      enabled: localStorage.getItem("chatgpt-enabled") !== "false"
    };

    const container = document.createElement("div");
    container.id = "chatgpt-cleaner-wrapper";
    Object.assign(container.style, {
      position: "fixed", bottom: "8px", right: "8px", zIndex: 9999, fontFamily: "sans-serif"
    });

    const toggleButton = document.createElement("button");
    toggleButton.textContent = "⚙";
    Object.assign(toggleButton.style, {
      background: stored.enabled ? "#444" : "red", color: "#fff", border: "none",
      borderRadius: "4px", padding: "2px 6px", cursor: "pointer", fontSize: "14px"
    });
    toggleButton.title = "Toggle cleaner panel";

    const panel = document.createElement("div");
    panel.id = "chatgpt-cleaner-panel";
    Object.assign(panel.style, {
      display: "none", marginTop: "4px", background: "#222", color: "#fff",
      padding: "10px 12px 10px 10px", borderRadius: "6px", fontSize: "12px",
      boxShadow: "0 0 6px rgba(0,0,0,0.5)", border: "1px solid #555", position: "relative", opacity: "0.95"
    });

    panel.innerHTML = `
      <div id="chatgpt-close" style="position:absolute;top:0px;right:2px;font-size:16px;font-weight:bold;color:#ccc;cursor:pointer;">✖</div>
      <label>
        Keep <input id="chatgpt-keep-count" type="number" value="${stored.leaveOnly}" min="1"
        style="width:52px;min-width:52px;padding:2px 6px 2px 4px;font-size:12px;background:#111;color:#fff;border:1px solid #555;box-sizing:border-box;"> messages
      </label>
      <br>
      <label>
        Interval <input id="chatgpt-interval" type="number" value="${stored.intervalSec}" min="2"
        style="width:52px;min-width:52px;padding:2px 6px 2px 4px;font-size:12px;background:#111;color:#fff;border:1px solid #555;box-sizing:border-box;"> sec
      </label>
      <br>
      <label><input type="checkbox" id="chatgpt-enabled" ${stored.enabled ? "checked" : ""}> Auto-clean enabled</label>
      <br>
      <button id="chatgpt-clean-now" style="
        margin-top:6px;background:#008000;color:#fff;border:none;border-radius:4px;
        padding:2px 8px;cursor:pointer;font-size:12px;">Clean now</button>
    `;

    toggleButton.onclick = () => { panel.style.display = "block"; toggleButton.style.display = "none"; };
    container.appendChild(toggleButton);
    container.appendChild(panel);
    document.body.appendChild(container);

    const countInput = panel.querySelector("#chatgpt-keep-count");
    const intervalInput = panel.querySelector("#chatgpt-interval");
    const enabledCheckbox = panel.querySelector("#chatgpt-enabled");
    const cleanNowBtn = panel.querySelector("#chatgpt-clean-now");
    const closeBtn = panel.querySelector("#chatgpt-close");

    let leaveOnly = stored.leaveOnly;
    let intervalMs = Math.max(2000, stored.intervalSec * 1000);
    let enabled = stored.enabled;
    let intervalId = null;


    function scheduleClean(force = false) {
      if (!force) {
        if (!enabled) return;
        if (document.hidden) return;
      }
      cleanOldMessages(force);
    }


    // ---------- main cleaner (no gating here; gating is in scheduleClean) ----------
    function cleanOldMessages(manual = false) {
      try {
        if (manual) console.info("[AutoCleaner] Manual clean");
        // 1) Trim DOM (visual only)
        const all = document.querySelectorAll('[data-testid^="conversation-turn-"]');
        if (all.length) {
          const lastAttr = all[all.length - 1].getAttribute("data-testid");
          const last = parseInt(lastAttr?.split("-")[2]);
          if (!isNaN(last)) {
            all.forEach(item => {
              const idx = parseInt(item.getAttribute("data-testid")?.split("-")[2]);
              if (!isNaN(idx) && idx < last - leaveOnly) item.remove();
            });
          }
        }
        // console.info("[AutoCleaner] Working...");

      } catch (e) {
        console.error("[AutoCleaner] clean error:", e);
      }
    }

    function startCleaner() {
      if (intervalId) clearInterval(intervalId);
      intervalId = setInterval(() => scheduleClean(false), intervalMs);
      console.info(`[AutoCleaner] Started: interval=${intervalMs}ms, keep=${leaveOnly}`);
    }

    // ---------- handlers ----------
    enabledCheckbox.onchange = () => {
      enabled = enabledCheckbox.checked;
      localStorage.setItem("chatgpt-enabled", enabled);
      toggleButton.style.background = enabled ? "#444" : "red";
      console.debug("[AutoCleaner] enabled =", enabled);
    };

    countInput.oninput = () => {
      const val = parseInt(countInput.value);
      if (!isNaN(val) && val > 0) {
        leaveOnly = val;
        localStorage.setItem("chatgpt-leaveOnly", val);
        console.debug("[AutoCleaner] keep set to", leaveOnly);
      }
    };

    intervalInput.oninput = () => {
      const val = parseInt(intervalInput.value);
      if (!isNaN(val) && val > 1) {
        intervalMs = Math.max(2000, val * 1000);
        localStorage.setItem("chatgpt-intervalSec", val);
        startCleaner();
      }
    };

    cleanNowBtn.onclick = () => {
      console.info("[AutoCleaner] CLEAN NOW clicked");
      scheduleClean(true);
      panel.style.display = "none";
      toggleButton.style.display = "inline-block";
    };

    closeBtn.onclick = () => {
      panel.style.display = "none";
      toggleButton.style.display = "inline-block";
    };

    startCleaner();
  }

  if (document.readyState === "complete" || document.readyState === "interactive") {
    injectUI();
  } else {
    window.addEventListener("DOMContentLoaded", injectUI);
  }

  const observer = new MutationObserver(() => {
    if (!document.getElementById("chatgpt-cleaner-wrapper")) injectUI();
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();

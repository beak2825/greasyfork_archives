// ==UserScript==
// @name         Grok+
// @namespace    https://6942020.xyz/
// @version      1.5.2
// @description  Adds back Grok 2 and shows rate limits
// @author       WadeGrimridge
// @match        https://grok.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530706/Grok%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/530706/Grok%2B.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const CONFIG = {
    MAX_RETRIES: 10,
    RETRY_DELAY: 1000,
    RATE_LIMIT_ENDPOINT: "/rest/rate-limits",
    REQUEST_KINDS: ["DEFAULT", "REASONING", "DEEPSEARCH", "DEEPERSEARCH"],
    MODELS: {
      "grok-2": { displayName: "Grok 2" },
      "grok-3": {
        DEFAULT: "Grok 3",
        REASONING: "Think",
        DEEPSEARCH: "DeepSearch",
        DEEPERSEARCH: "DeeperSearch",
      },
    },
  };

  const state = {
    rateInfoElement: null,
    selectedModel: "grok-3",
    modelRateLimits: {
      "grok-2": null,
      "grok-3": {
        DEFAULT: null,
        REASONING: null,
        DEEPSEARCH: null,
        DEEPERSEARCH: null,
      },
    },
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
    return remainingSeconds > 0
      ? `${minutes}m ${remainingSeconds}s`
      : `${minutes}m`;
  };

  const isValidRateData = (data) =>
    data &&
    typeof data.remainingQueries === "number" &&
    typeof data.totalQueries === "number" &&
    (typeof data.windowSizeSeconds === "number" ||
      typeof data.waitTimeSeconds === "number");

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const fetchRateLimit = async (
    modelName,
    requestKind = "DEFAULT",
    attempt = 1
  ) => {
    try {
      const response = await fetch(CONFIG.RATE_LIMIT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestKind, modelName }),
      });

      if (response.status !== 200 && attempt <= CONFIG.MAX_RETRIES) {
        await sleep(CONFIG.RETRY_DELAY);
        return fetchRateLimit(modelName, requestKind, attempt + 1);
      }

      const data = await response.json();
      if (!isValidRateData(data)) return;

      updateRateInfo(data, modelName, requestKind);
    } catch (error) {
      console.error("[grok-ratelimit] Rate limit fetch failed:", error);
      if (attempt > CONFIG.MAX_RETRIES && state.rateInfoElement) {
        state.rateInfoElement.textContent = "Couldn't fetch ratelimit info";
      }
    }
  };

  const formatRateLimitLine = (data, displayName) => {
    const timeStr = data.waitTimeSeconds
      ? formatTime(data.waitTimeSeconds)
      : formatTime(data.windowSizeSeconds);
    return `${displayName}: ${data.remainingQueries}/${data.totalQueries} (${timeStr})`;
  };

  const updateRateInfo = (data, modelName, requestKind = "DEFAULT") => {
    if (!state.rateInfoElement) return;

    if (modelName === "grok-3") {
      state.modelRateLimits[modelName][requestKind] = data;
    } else {
      state.modelRateLimits[modelName] = data;
    }

    const lines = [];

    CONFIG.REQUEST_KINDS.forEach((kind) => {
      const modelData = state.modelRateLimits["grok-3"][kind];
      if (modelData) {
        lines.push(
          formatRateLimitLine(modelData, CONFIG.MODELS["grok-3"][kind])
        );
      }
    });

    const grok2Data = state.modelRateLimits["grok-2"];
    if (grok2Data) {
      lines.push(
        formatRateLimitLine(grok2Data, CONFIG.MODELS["grok-2"].displayName)
      );
    }

    state.rateInfoElement.textContent = lines.join(" | ");
  };

  const interceptFetch = () => {
    const originalFetch = window.fetch;
    window.fetch = async function (...args) {
      const [resource, options] = args;
      const url =
        resource instanceof Request ? resource.url : resource.toString();

      const isChatUrl = (url) => {
        return (
          (url.includes("/rest/app-chat/conversations/") &&
            url.endsWith("/responses")) ||
          url === "https://grok.com/rest/app-chat/conversations/new"
        );
      };

      if (options?.method === "POST" && isChatUrl(url)) {
        try {
          const body = JSON.parse(options.body);
          if (body.modelName && state.selectedModel === "grok-2") {
            const newOptions = { ...options };
            body.modelName = "grok-2";
            newOptions.body = JSON.stringify(body);
            args[1] = newOptions;
          }
        } catch {}
      }

      if (!url.includes(CONFIG.RATE_LIMIT_ENDPOINT)) {
        return originalFetch.apply(this, args);
      }

      const response = await originalFetch.apply(this, args);
      const { modelName, requestKind } = JSON.parse(options.body);
      const clone = response.clone();
      clone.json().then((data) => {
        if (isValidRateData(data)) {
          updateRateInfo(data, modelName, requestKind);
        }
      });

      return response;
    };
  };

  const createRateInfoElement = () => {
    const targetDiv = document.querySelector("main .absolute.start-1");
    if (!targetDiv || state.rateInfoElement) return;

    const headerDiv = targetDiv.parentElement;
    const classesToRemove = [
      "@[80rem]/nav:h-0",
      "@[80rem]/nav:top-8",
      "@[80rem]/nav:from-transparent",
      "@[80rem]/nav:via-transparent",
    ];
    headerDiv.className = headerDiv.className
      .split(" ")
      .filter((c) => !classesToRemove.includes(c))
      .join(" ");

    state.rateInfoElement = document.createElement("div");
    state.rateInfoElement.className = "ml-2 text-sm break-words";
    state.rateInfoElement.style.maxWidth = "calc(100vw - 240px)";
    state.rateInfoElement.textContent = "Fetching ratelimit info...";
    targetDiv.appendChild(state.rateInfoElement);

    initializeRateLimits();
  };

  const initializeRateLimits = async () => {
    await fetchRateLimit("grok-3", "DEFAULT");
    for (const kind of CONFIG.REQUEST_KINDS.slice(1)) {
      await sleep(100);
      await fetchRateLimit("grok-3", kind);
    }
    await sleep(100);
    await fetchRateLimit("grok-2");
  };

  const waitForElement = () => {
    const targetDiv = document.querySelector("main .absolute.start-1");
    if (targetDiv) {
      createRateInfoElement();
    } else {
      requestAnimationFrame(waitForElement);
    }
  };

  const createModelPickerOverlay = () => {
    if (document.getElementById("model-picker-overlay")) return;
    const overlay = document.createElement("div");
    overlay.id = "model-picker-overlay";
    Object.assign(overlay.style, {
      position: "fixed",
      bottom: "16px",
      right: "16px",
      backgroundColor: "white",
      border: "1px solid #ccc",
      borderRadius: "8px",
      padding: "8px",
      display: "flex",
      gap: "8px",
      zIndex: "10000",
      fontSize: "14px",
    });
    const makeButton = (model, label) => {
      const btn = document.createElement("button");
      btn.textContent = label;
      btn.dataset.model = model;
      btn.style.padding = "4px 8px";
      btn.style.cursor = "pointer";
      btn.style.border = "1px solid #888";
      btn.style.borderRadius = "4px";
      btn.style.backgroundColor =
        state.selectedModel === model ? "#ddd" : "white";
      btn.addEventListener("click", () => {
        state.selectedModel = model;
        overlay.querySelectorAll("button").forEach((b) => {
          b.style.backgroundColor =
            b.dataset.model === model ? "#ddd" : "white";
        });
      });
      return btn;
    };
    overlay.appendChild(makeButton("grok-3", "Grok 3"));
    overlay.appendChild(makeButton("grok-2", "Grok 2"));
    document.body.appendChild(overlay);
  };

  interceptFetch();
  waitForElement();
  createModelPickerOverlay();
})();

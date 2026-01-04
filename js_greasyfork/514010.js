// ==UserScript==
// @name         ReadTheory Average Grade Level Calculator (Past 10 Quizzes)
// @namespace    https://greasyfork.org/en/users/567951-stuart-saddler
// @version      1.16
// @description  Calculates the average of the most recent 10 quizzes on ReadTheory.org
// @author       Stuart Saddler
// @icon         https://images-na.ssl-images-amazon.com/images/I/41Y-bktG5oL.png
// @license      MIT
// @match        *://readtheory.org/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/514010/ReadTheory%20Average%20Grade%20Level%20Calculator%20%28Past%2010%20Quizzes%29.user.js
// @updateURL https://update.greasyfork.org/scripts/514010/ReadTheory%20Average%20Grade%20Level%20Calculator%20%28Past%2010%20Quizzes%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // -------- SPA routing hook (document-start) --------
  // Monkeypatch pushState/replaceState so we can detect client-side route changes.
  const _pushState = history.pushState;
  const _replaceState = history.replaceState;

  function emitLocationChange(detail) {
    window.dispatchEvent(new CustomEvent("locationchange", { detail }));
  }

  history.pushState = function () {
    const ret = _pushState.apply(this, arguments);
    emitLocationChange({ type: "pushState" });
    return ret;
  };

  history.replaceState = function () {
    const ret = _replaceState.apply(this, arguments);
    emitLocationChange({ type: "replaceState" });
    return ret;
  };

  window.addEventListener("popstate", function () {
    emitLocationChange({ type: "popstate" });
  });

  // -------- Config and state --------
  const NUM_RECENT = 10;
  const DEBUG = true;

  let booted = false;                // global guard so we do not double-initialize
  let destroying = false;            // to avoid races during teardown
  let observers = [];                // track observers to disconnect on teardown
  let lastCalculatedData = null;
  let isProcessing = false;
  let hasSuccessfulResult = false;
  let cachedTable = null;
  let cacheTimestamp = 0;
  const CACHE_DURATION = 10000; // 10 seconds
  let changeTimeout = null;
  let locationPoller = null;

  function log() {
    if (!DEBUG) return;
    const args = Array.from(arguments);
    args.unshift("[ReadTheory Average]");
    console.log.apply(console, args);
  }

  // -------- Helpers to start/stop the feature on correct routes --------
  function onReportsRoute() {
    // Run on any teacher reports routes, including student detail pages.
    // Example: /app/teacher/reports/... or /app/teacher/reports/student/...
    const p = location.pathname;
    return p.startsWith("/app/teacher/reports/");
  }

  function debounce(fn, delay) {
    let t;
    return function () {
      clearTimeout(t);
      const self = this;
      const args = arguments;
      t = setTimeout(function () {
        fn.apply(self, args);
      }, delay);
    };
  }

  // -------- Main feature lifecycle --------
  async function boot() {
    if (booted || destroying) return;
    if (!onReportsRoute()) return;

    booted = true;
    lastCalculatedData = null;
    isProcessing = false;
    hasSuccessfulResult = false;
    cachedTable = null;
    cacheTimestamp = 0;

    // Make a retry function for the floating button.
    window.retryCalculation = async () => {
      log("Manual retry triggered");
      hasSuccessfulResult = false;
      cachedTable = null;
      cacheTimestamp = 0;
      await calculateAndDisplayAverage(true);
    };

    // A short wait gives Vue time to mount initial shells.
    await wait(600);

    // Start watchers that should be active only on the reports pages.
    setupVueReactivityObserver();
    setupEnhancedChangeDetection();

    // Safety polling in case the app updates without classic events firing.
    startLocationPoller();

    // Try initial run. We also do a small stagger to let the "Quiz History" panel render.
    await wait(800);
    await calculateAndDisplayAverage(true);

    log("Initialized on reports route");
  }

  function teardown() {
    if (!booted) return;
    destroying = true;
    try {
      // Disconnect observers
      observers.forEach(o => {
        try { o.disconnect(); } catch (e) {}
      });
      observers = [];

      // Clear timers
      if (changeTimeout) {
        clearTimeout(changeTimeout);
        changeTimeout = null;
      }
      if (locationPoller) {
        clearInterval(locationPoller);
        locationPoller = null;
      }

      // Remove floating window to avoid stale state if we leave the route
      const el = document.getElementById("average-grade-floating-window");
      if (el && el.parentNode) el.parentNode.removeChild(el);

      // Reset state
      lastCalculatedData = null;
      isProcessing = false;
      hasSuccessfulResult = false;
      cachedTable = null;
      cacheTimestamp = 0;
    } finally {
      booted = false;
      destroying = false;
      log("Teardown complete");
    }
  }

  // Re-evaluate on SPA route changes
  const onLocationChange = debounce(() => {
    log("locationchange detected:", location.pathname + location.search);
    if (onReportsRoute()) {
      if (!booted) boot();
      else {
        // Same feature, new sub-route or params
        hasSuccessfulResult = false;
        cachedTable = null;
        cacheTimestamp = 0;
        debounceCalculation(1200);
      }
    } else {
      teardown();
    }
  }, 150);

  window.addEventListener("locationchange", onLocationChange);

  // Also run once the DOM is ready. We cannot run heavy DOM work at document-start.
  function onReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  }

  onReady(() => {
    // Initial decision based on current route
    if (onReportsRoute()) boot();
    // As a safety net, also check when the tab becomes visible again
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) onLocationChange();
    });
  });

  // -------- Utility waits --------
  function wait(ms) {
    return new Promise(r => setTimeout(r, ms));
  }

  // -------- Your original logic (lightly organized) --------
  function getCachedTable() {
    const now = Date.now();
    if (cachedTable && (now - cacheTimestamp) < CACHE_DURATION) {
      if (document.body.contains(cachedTable)) {
        return cachedTable;
      }
    }
    cachedTable = findQuizHistoryTable();
    cacheTimestamp = now;
    return cachedTable;
  }

  async function waitForQuizTable(maxAttempts = 12, baseWaitTime = 600) {
    for (let i = 0; i < maxAttempts; i++) {
      log("Attempt", i + 1, "/", maxAttempts, "looking for quiz table...");
      const table = findQuizHistoryTable();
      if (table) {
        const dataRows = getTopRowsByNumberCell(table, 1);
        if (dataRows.length > 0) {
          cachedTable = table;
          cacheTimestamp = Date.now();
          return table;
        }
      }
      const currentWaitTime = Math.min(baseWaitTime + i * 200, 1600);
      await wait(currentWaitTime);
    }
    return await fallbackTableDetection();
  }

  async function fallbackTableDetection() {
    const tables = document.querySelectorAll("table");
    for (const table of tables) {
      const hasNumericData = Array.from(table.querySelectorAll("td")).some(td =>
        /^\d+$/.test(td.textContent.trim())
      );
      const hasGradeData = Array.from(table.querySelectorAll("td")).some(td =>
        /^(one|two|three|four|five|six|seven|eight|nine|ten|\d+\.?\d*)$/i.test(td.textContent.trim())
      );
      if (hasNumericData && hasGradeData) {
        log("Fallback table detection successful");
        return table;
      }
    }
    return null;
  }

  function findQuizHistoryTable() {
    const strategies = [
      () => document.querySelector("table.hi-table.desktop-only"),
      () => {
        const tables = Array.from(document.querySelectorAll("table"));
        return tables.find(t => t.querySelector("td.number-cell"));
      },
      () => {
        const quizPanel = document.querySelector(".quiz-history-panel");
        return quizPanel ? quizPanel.querySelector("table") : null;
      },
      () => {
        const vueTables = document.querySelectorAll("table[data-v-07edfc42], table[class*='hi-table']");
        return vueTables.length > 0 ? vueTables[0] : null;
      },
      () => {
        const tables = Array.from(document.querySelectorAll("table"));
        return tables.find(table => {
          const hasHeaders = table.querySelector("thead th");
          const hasRows = table.querySelectorAll("tbody tr").length > 0;
          return hasHeaders && hasRows;
        });
      }
    ];
    for (let i = 0; i < strategies.length; i++) {
      const result = strategies[i]();
      if (result) {
        log("Found table using strategy", i + 1);
        return result;
      }
    }
    return null;
  }

  function setupVueReactivityObserver() {
    const observer = new MutationObserver((mutations) => {
      let shouldRecalc = false;
      for (const mutation of mutations) {
        if (mutation.type === "attributes" && mutation.attributeName && mutation.attributeName.startsWith("data-v-")) {
          shouldRecalc = true;
        }
        if (mutation.target.tagName === "TABLE" ||
            (mutation.target.closest && mutation.target.closest("table"))) {
          shouldRecalc = true;
          cachedTable = null;
          cacheTimestamp = 0;
        }
        if (mutation.target.classList &&
            (mutation.target.classList.contains("activity-tab") ||
             mutation.target.classList.contains("active"))) {
          shouldRecalc = true;
        }
      }
      if (shouldRecalc && !isProcessing) {
        log("Vue reactivity change detected");
        debounceCalculation(600);
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-v-07edfc42", "class", "aria-selected"]
    });
    observers.push(observer);
  }

  function setupEnhancedChangeDetection() {
    const checkForChanges = () => {
      if (isProcessing) return;
      debounceCalculation(800);
    };
    window.addEventListener("hashchange", checkForChanges);
    document.addEventListener("click", (e) => {
      if (e.target && typeof e.target.closest === "function") {
        if (e.target.closest("[class*='student'], [class*='selector'], select, .activity-tab, a, button")) {
          debounceCalculation(800);
        }
      }
    });
    document.addEventListener("change", (event) => {
      if (event.target.tagName === "SELECT" && !isProcessing) {
        updateDisplay("Average Grade Level: Student changed, loading new data...");
        hasSuccessfulResult = false;
        cachedTable = null;
        cacheTimestamp = 0;
        debounceCalculation(900);
      }
    });
  }

  function startLocationPoller() {
    // Safety net for any framework updates that do not trigger our hooks
    if (locationPoller) return;
    let last = location.pathname + location.search + location.hash;
    locationPoller = setInterval(() => {
      const cur = location.pathname + location.search + location.hash;
      if (cur !== last) {
        last = cur;
        emitLocationChange({ type: "poll" });
      }
    }, 1000);
  }

  function gradeTextToNumber(gradeText) {
    if (!gradeText) return 0;
    const txt = String(gradeText).toLowerCase().trim();
    const map = {
      "one": 1, "two": 2, "three": 3, "four": 4, "five": 5, "six": 6,
      "seven": 7, "eight": 8, "nine": 9, "ten": 10, "eleven": 11, "twelve": 12,
      "thirteen": 13, "fourteen": 14, "fifteen": 15
    };
    if (map[txt] != null) return map[txt];
    const num = parseFloat(txt.replace(/[^0-9.]/g, ""));
    return Number.isFinite(num) ? num : 0;
  }

  function calculateAverage(nums) {
    const valid = nums.filter(n => Number.isFinite(n) && n > 0);
    if (valid.length === 0) return "0.0";
    const total = valid.reduce((a, b) => a + b, 0);
    return (total / valid.length).toFixed(1);
  }

  function findGradeColumnIndex(table) {
    const firstGradeTd = table.querySelector("tbody tr td.grade-level-cell");
    if (firstGradeTd) {
      const all = Array.from(firstGradeTd.parentElement.querySelectorAll("td"));
      const index = all.indexOf(firstGradeTd);
      log("Found grade column at index", index, "using grade-level-cell class");
      return index;
    }
    const ths = Array.from(table.querySelectorAll("thead th, tr:first-child th"));
    for (let i = 0; i < ths.length; i++) {
      const headerText = (ths[i].textContent || "").toLowerCase();
      if (headerText.includes("grade") && headerText.includes("level")) {
        log("Found grade column at index", i, "using header text");
        return i;
      }
    }
    const rows = Array.from(table.querySelectorAll("tbody tr")).slice(0, 5);
    const gradeWords = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];
    for (const row of rows) {
      const cells = Array.from(row.querySelectorAll("td"));
      for (let i = 0; i < cells.length; i++) {
        const text = cells[i].textContent.toLowerCase().trim();
        if (gradeWords.includes(text) || /^\d+\.?\d*$/.test(text)) {
          let gradeMatches = 0;
          for (const testRow of rows.slice(0, 3)) {
            const testCells = Array.from(testRow.querySelectorAll("td"));
            if (testCells[i]) {
              const testText = testCells[i].textContent.toLowerCase().trim();
              if (gradeWords.includes(testText) || /^\d+\.?\d*$/.test(testText)) {
                gradeMatches++;
              }
            }
          }
          if (gradeMatches >= 2) {
            log("Found grade column at index", i, "based on content analysis");
            return i;
          }
        }
      }
    }
    return -1;
  }

  function getTopRowsByNumberCell(table, n) {
    const rows = Array.from(table.querySelectorAll("tbody tr"));
    const validRows = rows.filter(tr => {
      const numberCell = tr.querySelector("td.number-cell");
      if (numberCell) return true;
      const cells = Array.from(tr.querySelectorAll("td"));
      return cells.some(cell => {
        const text = cell.textContent.trim();
        return /^#?\d+$/.test(text) && parseInt(text.replace("#", "")) > 0;
      });
    });
    validRows.sort((a, b) => {
      const getRowNumber = (row) => {
        const numberCell = row.querySelector("td.number-cell");
        if (numberCell) {
          const num = parseInt(numberCell.textContent.replace(/\D/g, ""), 10);
          return isNaN(num) ? 0 : num;
        }
        const cells = Array.from(row.querySelectorAll("td"));
        for (const cell of cells) {
          const text = cell.textContent.trim();
          if (/^#?\d+$/.test(text)) {
            const num = parseInt(text.replace(/\D/g, ""), 10);
            return isNaN(num) ? 0 : num;
          }
        }
        return 0;
      };
      return getRowNumber(b) - getRowNumber(a);
    });
    return validRows.slice(0, n);
  }

  function getCurrentDataSignature() {
    const table = getCachedTable();
    if (!table) return null;
    const rows = getTopRowsByNumberCell(table, NUM_RECENT);
    const signature = rows.map(row => {
      const cells = Array.from(row.querySelectorAll("td"));
      return cells.slice(0, 4).map(cell => cell.textContent.trim()).join("|");
    }).join("::");
    return signature || "empty";
  }

  async function calculateAndDisplayAverage(forceRecalc = false) {
    if (!onReportsRoute()) return false;
    if (isProcessing) return false;
    try {
      isProcessing = true;
      const currentSignature = getCurrentDataSignature();
      if (!forceRecalc && hasSuccessfulResult && currentSignature === lastCalculatedData && currentSignature !== null) {
        log("Data unchanged, skipping recalculation");
        return true;
      }
      updateDisplay("Average Grade Level: Switching to Quiz History tab...");
      const tabSwitched = await switchToQuizHistoryTab();
      if (!tabSwitched) {
        updateDisplayWithRetry("Average Grade Level: Could not switch to Quiz History tab");
        return false;
      }
      updateDisplay("Average Grade Level: Loading quiz data...");
      const table = await waitForQuizTable(14, 700);
      if (!table) {
        updateDisplayWithRetry("Average Grade Level: No quiz data found");
        return false;
      }
      const allRows = Array.from(table.querySelectorAll("tbody tr"));
      if (allRows.length === 0) {
        updateDisplayWithRetry("Average Grade Level: No quiz rows found");
        return false;
      }
      const colIdx = findGradeColumnIndex(table);
      if (colIdx === -1) {
        updateDisplayWithRetry("Average Grade Level: Grade level column not found");
        return false;
      }
      const recentRows = getTopRowsByNumberCell(table, NUM_RECENT);
      if (recentRows.length === 0) {
        updateDisplayWithRetry("Average Grade Level: No valid recent quizzes found");
        return false;
      }
      const grades = recentRows.map(tr => {
        const cells = Array.from(tr.querySelectorAll("td"));
        const td = cells[colIdx];
        const gradeText = td ? td.textContent.trim() : "";
        return gradeTextToNumber(gradeText);
      });
      const usedCount = grades.filter(g => g > 0).length;
      if (usedCount === 0) {
        updateDisplayWithRetry("Average Grade Level: No valid grades found");
        return false;
      }
      const avg = calculateAverage(grades);
      const mostRecentNum = getMostRecentNumber(recentRows);
      const studentName = getStudentName();
      updateDisplay(
        studentName + "\n" +
        "Average Grade Level (last " + usedCount + " quizzes): " + avg + "\n" +
        "Most recent quiz: #" + mostRecentNum
      );
      hasSuccessfulResult = true;
      lastCalculatedData = getCurrentDataSignature();
      log("Success:", avg, "from", usedCount, "quizzes");
      return true;
    } catch (error) {
      log("Calculation error:", error);
      updateDisplayWithRetry("Average Grade Level: Error - " + error.message);
      return false;
    } finally {
      isProcessing = false;
    }
  }

  function getMostRecentNumber(recentRows) {
    const firstRow = recentRows[0];
    if (!firstRow) return "unknown";
    const numberCell = firstRow.querySelector("td.number-cell");
    if (numberCell) {
      const num = parseInt(numberCell.textContent.replace(/\D/g, ""), 10);
      return isNaN(num) ? "unknown" : num;
    }
    return "unknown";
  }

  function getStudentName() {
    const nameSpan = document.querySelector(".student-report-action-container.teacher-container span.user-name");
    if (nameSpan) {
      const fullName = nameSpan.textContent.trim();
      const parts = fullName.split(",");
      if (parts.length > 1) {
        return parts[1].trim();
      }
      return fullName;
    }
    return "(Unknown Student)";
  }

  // -------- Tab control --------
  function findQuizHistoryTab() {
    const strategies = [
      () => {
        const tabs = document.querySelectorAll(".activity-tab");
        for (const tab of tabs) {
          const text = tab.textContent.trim().toLowerCase();
          if (text.includes("quiz") && text.includes("history")) return tab;
        }
        return null;
      },
      () => {
        const elements = document.querySelectorAll("a, button, [role='tab'], [class*='tab']");
        for (const elem of elements) {
          const text = elem.textContent.trim().toLowerCase();
          if (text.includes("quiz") && text.includes("history")) return elem;
        }
        return null;
      },
      () => {
        const vueElements = document.querySelectorAll("[data-v-07edfc42], [class*='quiz-history']");
        for (const elem of vueElements) {
          const t = elem.textContent.toLowerCase();
          if (t.includes("quiz") && t.includes("history")) return elem;
        }
        return null;
      }
    ];
    for (const strategy of strategies) {
      const result = strategy();
      if (result) return result;
    }
    return null;
  }

  function isQuizHistoryTabActive() {
    const activeTab = document.querySelector(".activity-tab.active, [role='tab'][aria-selected='true']");
    if (activeTab) {
      const text = activeTab.textContent.trim().toLowerCase();
      if (text.includes("quiz") && text.includes("history")) return true;
    }
    const quizTable = getCachedTable();
    const hasQuizHistoryPanel = document.querySelector(".quiz-history-panel");
    if (quizTable || hasQuizHistoryPanel) return true;
    return false;
  }

  async function switchToQuizHistoryTab() {
    if (isQuizHistoryTabActive()) return true;
    const quizTab = findQuizHistoryTab();
    if (!quizTab) return false;

    const clickEvents = ["mousedown", "mouseup", "click"];
    for (const ev of clickEvents) {
      quizTab.dispatchEvent(new MouseEvent(ev, { bubbles: true, cancelable: true, view: window }));
    }

    for (let i = 0; i < 10; i++) {
      await wait(200 + i * 60);
      if (isQuizHistoryTabActive()) {
        cachedTable = null;
        cacheTimestamp = 0;
        return true;
      }
    }
    return false;
  }

  // -------- Floating UI --------
  function updateDisplay(message) {
    const box = ensureFloatingWindow();
    box.innerHTML = message;
  }

  function updateDisplayWithRetry(message) {
    const box = ensureFloatingWindow();
    box.innerHTML = message + '<br><button onclick="window.retryCalculation()" style="margin-top: 8px; padding: 4px 8px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Retry</button>';
  }

  function ensureFloatingWindow() {
    let el = document.getElementById("average-grade-floating-window");
    if (!el) {
      el = document.createElement("div");
      el.id = "average-grade-floating-window";
      Object.assign(el.style, {
        position: "fixed",
        bottom: "20px",
        right: "20px",
        padding: "12px",
        backgroundColor: "#ffffff",
        border: "2px solid #007bff",
        borderRadius: "8px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
        zIndex: "9999",
        fontSize: "14px",
        fontFamily: "Arial, sans-serif",
        color: "#333333",
        maxWidth: "350px",
        lineHeight: "1.4",
        whiteSpace: "pre-line"
      });
      document.body.appendChild(el);
    }
    return el;
  }

  // -------- Debounced calc trigger --------
  function debounceCalculation(delay = 600) {
    if (changeTimeout) clearTimeout(changeTimeout);
    changeTimeout = setTimeout(async () => {
      if (!isProcessing) {
        hasSuccessfulResult = false;
        await calculateAndDisplayAverage(true);
      }
    }, delay);
  }
})();

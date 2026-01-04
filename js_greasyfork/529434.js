// ==UserScript==
// @name         Bomb Party Suggester
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  Suggests words containing the required syllable for JKLM.fun Bomb Party game with customizable dictionaries and sorting options
// @author       Doomsy1
// @match        *.jklm.fun/games/bombparty*
// @grant        none
// @run-at       document-start
// @supportURL   https://github.com/Doomsy1/Bomb-Party-Suggester/issues
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jklm.fun
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529434/Bomb%20Party%20Suggester.user.js
// @updateURL https://update.greasyfork.org/scripts/529434/Bomb%20Party%20Suggester.meta.js
// ==/UserScript==
(() => {
  // src/core/typer.js
  window.BPS = window.BPS || {};
  (function() {
    let KEYBOARD_LAYOUT = {
      layout: {
        q: [0, 0],
        w: [0, 1],
        e: [0, 2],
        r: [0, 3],
        t: [0, 4],
        y: [0, 5],
        u: [0, 6],
        i: [0, 7],
        o: [0, 8],
        p: [0, 9],
        a: [1, 0],
        s: [1, 1],
        d: [1, 2],
        f: [1, 3],
        g: [1, 4],
        h: [1, 5],
        j: [1, 6],
        k: [1, 7],
        l: [1, 8],
        z: [2, 0],
        x: [2, 1],
        c: [2, 2],
        v: [2, 3],
        b: [2, 4],
        n: [2, 5],
        m: [2, 6]
      },
      adjacent: {}
    };
    Object.entries(KEYBOARD_LAYOUT.layout).forEach(([key, [row, col]]) => {
      KEYBOARD_LAYOUT.adjacent[key] = Object.entries(KEYBOARD_LAYOUT.layout).filter(([k, [r, c]]) => {
        if (k === key) return !1;
        let rowDiff = Math.abs(r - row), colDiff = Math.abs(c - col);
        return rowDiff <= 1 && colDiff <= 1;
      }).map(([k]) => k);
    });
    let TYPER_CONFIG = {
      baseDelay: 60,
      distanceMultiplier: 12.5,
      minDelay: 15,
      delayVariation: 0.2,
      typoChance: 2,
      typoNoticeDelay: { mean: 250, stdDev: 60 },
      typoBackspaceDelay: { mean: 100, stdDev: 40 },
      typoRecoveryDelay: { mean: 200, stdDev: 50 }
    };
    function loadSavedSettings() {
      let saved = localStorage.getItem("bombPartyTyperSettings");
      if (saved)
        try {
          let parsed = JSON.parse(saved);
          Object.assign(TYPER_CONFIG, parsed);
        } catch {
        }
    }
    function saveSettings() {
      try {
        localStorage.setItem("bombPartyTyperSettings", JSON.stringify(TYPER_CONFIG));
      } catch {
      }
    }
    function normalRandom(mean, stdDev) {
      let u = 0, v = 0;
      for (; u === 0; ) u = Math.random();
      for (; v === 0; ) v = Math.random();
      let num = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
      return Math.floor(num * stdDev + mean);
    }
    function calculateTypingDelay(fromKey, toKey) {
      if (!fromKey) return TYPER_CONFIG.baseDelay;
      fromKey = fromKey.toLowerCase(), toKey = toKey.toLowerCase();
      let fromPos = KEYBOARD_LAYOUT.layout[fromKey], toPos = KEYBOARD_LAYOUT.layout[toKey];
      if (!fromPos || !toPos) return TYPER_CONFIG.baseDelay;
      let distance = Math.sqrt(
        Math.pow(fromPos[0] - toPos[0], 2) + Math.pow(fromPos[1] - toPos[1], 2)
      ), meanDelay = TYPER_CONFIG.baseDelay + distance * TYPER_CONFIG.distanceMultiplier, stdDev = meanDelay * TYPER_CONFIG.delayVariation;
      return Math.max(TYPER_CONFIG.minDelay, normalRandom(meanDelay, stdDev));
    }
    async function simulateTypo(inputField, correctChar) {
      let c = correctChar.toLowerCase();
      if (!KEYBOARD_LAYOUT.adjacent[c] || Math.random() > TYPER_CONFIG.typoChance / 100) return !1;
      let neighbors = KEYBOARD_LAYOUT.adjacent[c], typoChar = neighbors[Math.floor(Math.random() * neighbors.length)];
      return inputField.value += typoChar, inputField.dispatchEvent(new Event("input", { bubbles: !0 })), await new Promise((resolve) => setTimeout(resolve, calculateTypingDelay(null, typoChar))), await new Promise((resolve) => setTimeout(
        resolve,
        normalRandom(TYPER_CONFIG.typoNoticeDelay.mean, TYPER_CONFIG.typoNoticeDelay.stdDev)
      )), inputField.value = inputField.value.slice(0, -1), inputField.dispatchEvent(new Event("input", { bubbles: !0 })), await new Promise((resolve) => setTimeout(
        resolve,
        normalRandom(TYPER_CONFIG.typoBackspaceDelay.mean, TYPER_CONFIG.typoBackspaceDelay.stdDev)
      )), inputField.value += correctChar, inputField.dispatchEvent(new Event("input", { bubbles: !0 })), await new Promise((resolve) => setTimeout(
        resolve,
        normalRandom(TYPER_CONFIG.typoRecoveryDelay.mean, TYPER_CONFIG.typoRecoveryDelay.stdDev)
      )), !0;
    }
    async function simulateTyping(word) {
      let selfTurn = document.querySelector(".selfTurn"), form = document.querySelector(".selfTurn form"), inputField = document.querySelector(".selfTurn input");
      if (!inputField || !form || selfTurn.hidden)
        return;
      inputField.value = "", inputField.focus();
      let lastChar = null;
      for (let i = 0; i < word.length; i++)
        await simulateTypo(inputField, word[i]) || (inputField.value += word[i], inputField.dispatchEvent(new Event("input", { bubbles: !0 })), await new Promise((resolve) => setTimeout(resolve, calculateTypingDelay(lastChar, word[i]))), lastChar = word[i]);
      form.dispatchEvent(new Event("submit", { bubbles: !0, cancelable: !0 }));
    }
    function isPlayerTurn() {
      let selfTurn = document.querySelector(".selfTurn");
      return selfTurn && !selfTurn.hidden;
    }
    loadSavedSettings(), window.BPS.KEYBOARD_LAYOUT = KEYBOARD_LAYOUT, window.BPS.TYPER_CONFIG = TYPER_CONFIG, window.BPS.loadSavedSettings = loadSavedSettings, window.BPS.saveSettings = saveSettings, window.BPS.normalRandom = normalRandom, window.BPS.calculateTypingDelay = calculateTypingDelay, window.BPS.simulateTyping = simulateTyping, window.BPS.isPlayerTurn = isPlayerTurn;
  })();

  // src/core/dictionaryLoader.js
  window.BPS = window.BPS || {};
  (function() {
    let dictionaries = {
      "5k": {
        url: "https://raw.githubusercontent.com/filiph/english_words/master/data/word-freq-top5000.csv",
        words: [],
        hasFrequency: !0
      },
      "20k": {
        url: "https://raw.githubusercontent.com/first20hours/google-10000-english/master/google-10000-english-usa.txt",
        words: [],
        hasFrequency: !0
      },
      "273k": {
        url: "https://raw.githubusercontent.com/kli512/bombparty-assist/refs/heads/main/bombparty/dictionaries/en.txt",
        words: [],
        hasFrequency: !1
      }
    };
    async function loadDictionary(size) {
      let dictionary = dictionaries[size], lines = (await (await fetch(dictionary.url)).text()).split(`
`);
      switch (size) {
        case "5k":
          let dataLines = lines.slice(1);
          dictionary.words = dataLines.map((line) => {
            let trimmed = line.trim();
            if (!trimmed) return { word: "", freq: 0 };
            let parts = trimmed.split(",");
            if (parts.length < 4) return { word: "", freq: 0 };
            let word = parts[1] || "", freq = parseInt(parts[3], 10) || 0;
            return { word, freq };
          });
          break;
        case "20k":
          dictionary.words = lines.map((line, idx) => ({
            word: line.trim(),
            freq: lines.length - idx
            // higher index = less frequent
          }));
          break;
        case "273k":
          dictionary.words = lines.filter((line) => line.trim().length > 0).map((line) => ({
            word: line.trim().toLowerCase(),
            freq: 1
            // treat all words equally
          }));
          break;
        default:
          return;
      }
      dictionary.words = dictionary.words.filter((entry) => entry.word);
    }
    async function loadAllDictionaries() {
      try {
        await Promise.all([
          loadDictionary("5k"),
          loadDictionary("20k"),
          loadDictionary("273k")
        ]);
      } catch {
      }
    }
    window.BPS.dictionaries = dictionaries, window.BPS.loadAllDictionaries = loadAllDictionaries;
  })();

  // src/ui/styles.js
  window.BPS = window.BPS || {};
  (function() {
    let styles = {
      colors: {
        primary: "#61dafb",
        background: "#282c34",
        text: "#ffffff",
        highlight: "#2EFF2E",
        special: "#FF8C00"
      },
      panel: {
        position: "fixed",
        top: "10px",
        right: "10px",
        backgroundColor: "rgba(40, 44, 52, 0.5)",
        border: "2px solid #61dafb",
        borderRadius: "8px",
        padding: "10px",
        zIndex: "2147483647",
        maxWidth: "500px",
        minWidth: "200px",
        minHeight: "150px",
        maxHeight: "800px",
        width: "300px",
        height: "400px",
        fontFamily: "sans-serif",
        fontSize: "14px",
        color: "#fff",
        boxShadow: "0px 4px 12px rgba(0,0,0,0.5)",
        cursor: "move",
        resize: "none",
        overflow: "hidden"
      },
      resizeHandle: {
        position: "absolute",
        width: "20px",
        height: "20px",
        background: "transparent",
        zIndex: "2147483647",
        cursor: "nw-resize"
      },
      resizeDot: {
        position: "absolute",
        width: "8px",
        height: "8px",
        background: "#61dafb",
        borderRadius: "50%",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)"
      },
      resizeEdge: {
        position: "absolute",
        background: "transparent",
        zIndex: "2147483647"
      },
      sizeSelector: {
        marginBottom: "4px",
        display: "flex",
        gap: "8px",
        justifyContent: "center"
      },
      sortControls: {
        marginBottom: "8px",
        display: "flex",
        gap: "8px",
        justifyContent: "center",
        flexWrap: "wrap"
      },
      sortButton: {
        padding: "4px 8px",
        border: "1px solid #61dafb",
        borderRadius: "4px",
        background: "transparent",
        color: "#fff",
        cursor: "pointer",
        fontSize: "12px",
        display: "flex",
        alignItems: "center",
        gap: "4px"
      },
      activeSortButton: {
        background: "#61dafb",
        color: "#282c34"
      },
      button: {
        padding: "4px 8px",
        border: "1px solid #61dafb",
        borderRadius: "4px",
        background: "transparent",
        color: "#fff",
        cursor: "pointer"
      },
      activeButton: {
        background: "#61dafb",
        color: "#282c34"
      },
      resultsList: {
        listStyle: "none",
        padding: "0",
        margin: "0"
      },
      resultsItem: {
        padding: "4px 0",
        textAlign: "center",
        fontSize: "14px",
        cursor: "pointer",
        transition: "background-color 0.2s",
        borderRadius: "4px"
      },
      resultsItemHover: {
        backgroundColor: "rgba(97, 218, 251, 0.2)"
      },
      resultsItemDisabled: {
        backgroundColor: "rgba(220, 53, 69, 0.2)"
      },
      resultsDiv: {
        height: "auto",
        overflowY: "visible",
        marginTop: "8px"
      },
      settingsButton: {
        position: "absolute",
        top: "10px",
        right: "10px",
        padding: "4px 8px",
        border: "1px solid #61dafb",
        borderRadius: "4px",
        background: "transparent",
        color: "#fff",
        cursor: "pointer",
        fontSize: "12px"
      },
      settingsPanel: {
        position: "fixed",
        top: "10px",
        left: "10px",
        backgroundColor: "rgba(40, 44, 52, 0.9)",
        border: "2px solid #61dafb",
        borderRadius: "8px",
        padding: "12px",
        zIndex: "2147483647",
        width: "220px",
        color: "#fff",
        fontFamily: "sans-serif",
        fontSize: "12px",
        cursor: "move",
        boxShadow: "0px 4px 12px rgba(0,0,0,0.5)"
      },
      settingsGroup: {
        marginBottom: "8px",
        display: "flex",
        flexDirection: "column"
      },
      settingsLabel: {
        display: "block",
        marginBottom: "2px",
        color: "#61dafb",
        fontSize: "11px"
      },
      settingsInputGroup: {
        display: "flex",
        gap: "8px",
        alignItems: "center"
      },
      settingsInput: {
        width: "50px",
        padding: "2px 4px",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        border: "1px solid #61dafb",
        borderRadius: "4px",
        color: "#fff",
        fontSize: "11px"
      },
      settingsSlider: {
        flex: 1,
        height: "4px",
        WebkitAppearance: "none",
        background: "rgba(97, 218, 251, 0.2)",
        borderRadius: "2px",
        outline: "none"
      }
    };
    function applyStyles(element, styleObj) {
      Object.assign(element.style, styleObj);
    }
    window.BPS.styles = styles, window.BPS.applyStyles = applyStyles;
  })();

  // src/ui/dragResize.js
  window.BPS = window.BPS || {};
  (function() {
    "use strict";
    let styles = window.BPS.styles, applyStyles = window.BPS.applyStyles;
    function makeDraggable(element) {
      let isDragging = !1, offsetX = 0, offsetY = 0;
      element.addEventListener("mousedown", (e) => {
        let tag = e.target.tagName.toLowerCase();
        tag === "button" || tag === "input" || (isDragging = !0, offsetX = e.clientX - element.offsetLeft, offsetY = e.clientY - element.offsetTop, e.preventDefault());
      }), document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        e.preventDefault();
        let x = e.clientX - offsetX, y = e.clientY - offsetY;
        element.style.left = Math.max(0, Math.min(window.innerWidth - element.offsetWidth, x)) + "px", element.style.top = Math.max(0, Math.min(window.innerHeight - element.offsetHeight, y)) + "px";
      }), document.addEventListener("mouseup", () => {
        isDragging = !1;
      });
    }
    function setupDraggableResize(panel) {
      [
        { corner: "nw", top: "-10px", left: "-10px", cursor: "nw-resize" },
        { corner: "ne", top: "-10px", right: "-10px", cursor: "ne-resize" },
        { corner: "se", bottom: "-10px", right: "-10px", cursor: "se-resize" },
        { corner: "sw", bottom: "-10px", left: "-10px", cursor: "sw-resize" }
      ].forEach((pos) => {
        let handle = document.createElement("div");
        handle.className = `resize-handle ${pos.corner}`, applyStyles(handle, { ...styles.resizeHandle, ...pos });
        let dot = document.createElement("div");
        applyStyles(dot, styles.resizeDot), handle.appendChild(dot), panel.appendChild(handle);
      }), [
        { edge: "n", top: "-5px", left: "20px", right: "20px", height: "10px", cursor: "ns-resize" },
        { edge: "s", bottom: "-5px", left: "20px", right: "20px", height: "10px", cursor: "ns-resize" },
        { edge: "e", top: "20px", right: "-5px", bottom: "20px", width: "10px", cursor: "ew-resize" },
        { edge: "w", top: "20px", left: "-5px", bottom: "20px", width: "10px", cursor: "ew-resize" }
      ].forEach((pos) => {
        let edge = document.createElement("div");
        edge.className = `resize-edge ${pos.edge}`, applyStyles(edge, { ...styles.resizeEdge, ...pos }), panel.appendChild(edge);
      });
      let draggingPanel = !1, offsetX = 0, offsetY = 0;
      panel.addEventListener("mousedown", (e) => {
        e.target.classList.contains("resize-handle") || e.target.classList.contains("resize-edge") || (draggingPanel = !0, offsetX = e.clientX - panel.getBoundingClientRect().left, offsetY = e.clientY - panel.getBoundingClientRect().top, e.preventDefault());
      }), panel.addEventListener("mousemove", (e) => {
        if (!draggingPanel) return;
        let newLeft = e.clientX - offsetX, newTop = e.clientY - offsetY;
        panel.style.left = Math.max(0, Math.min(window.innerWidth - panel.offsetWidth, newLeft)) + "px", panel.style.top = Math.max(0, Math.min(window.innerHeight - panel.offsetHeight, newTop)) + "px";
      }), panel.addEventListener("mouseup", () => {
        draggingPanel = !1;
      }), panel.addEventListener("mouseleave", () => {
        draggingPanel = !1;
      });
      let resizing = !1, currentResizer = null, startX, startY, startWidth, startHeight, panelLeft, panelTop;
      [
        ...panel.querySelectorAll(".resize-handle"),
        ...panel.querySelectorAll(".resize-edge")
      ].forEach((r) => {
        r.addEventListener("mousedown", (e) => {
          resizing = !0, currentResizer = r, startX = e.clientX, startY = e.clientY;
          let rect = panel.getBoundingClientRect();
          startWidth = rect.width, startHeight = rect.height, panelLeft = rect.left, panelTop = rect.top, e.preventDefault(), e.stopPropagation();
        });
      }), document.addEventListener("mousemove", (e) => {
        if (!resizing || !currentResizer) return;
        let dx = e.clientX - startX, dy = e.clientY - startY, maxW = parseInt(styles.panel.maxWidth, 10) || 500, minW = parseInt(styles.panel.minWidth, 10) || 200, maxH = parseInt(styles.panel.maxHeight, 10) || 800, minH = parseInt(styles.panel.minHeight, 10) || 150, newW = startWidth, newH = startHeight, newL = panelLeft, newT = panelTop, direction = currentResizer.classList[1];
        if (currentResizer.classList.contains("resize-handle"))
          switch (direction) {
            case "nw":
              newW = startWidth - dx, newH = startHeight - dy, newL = panelLeft + (startWidth - newW), newT = panelTop + (startHeight - newH);
              break;
            case "ne":
              newW = startWidth + dx, newH = startHeight - dy, newT = panelTop + (startHeight - newH);
              break;
            case "se":
              newW = startWidth + dx, newH = startHeight + dy;
              break;
            case "sw":
              newW = startWidth - dx, newH = startHeight + dy, newL = panelLeft + (startWidth - newW);
              break;
          }
        else
          switch (direction) {
            case "n":
              newH = startHeight - dy, newT = panelTop + (startHeight - newH);
              break;
            case "s":
              newH = startHeight + dy;
              break;
            case "e":
              newW = startWidth + dx;
              break;
            case "w":
              newW = startWidth - dx, newL = panelLeft + (startWidth - newW);
              break;
          }
        newW = Math.min(maxW, Math.max(minW, newW)), newH = Math.min(maxH, Math.max(minH, newH)), newL = Math.min(window.innerWidth - newW, Math.max(0, newL)), newT = Math.min(window.innerHeight - newH, Math.max(0, newT)), panel.style.width = newW + "px", panel.style.height = newH + "px", panel.style.left = newL + "px", panel.style.top = newT + "px";
      }), document.addEventListener("mouseup", () => {
        resizing = !1, currentResizer = null;
      });
    }
    window.BPS.makeDraggable = makeDraggable, window.BPS.setupDraggableResize = setupDraggableResize;
  })();

  // src/ui/settings.js
  window.BPS = window.BPS || {};
  (function() {
    "use strict";
    let styles = window.BPS.styles, applyStyles = window.BPS.applyStyles, TYPER_CONFIG = window.BPS.TYPER_CONFIG, saveSettings = window.BPS.saveSettings, loadSavedSettings = window.BPS.loadSavedSettings, makeDraggable = window.BPS.makeDraggable;
    function createSettingsPanel() {
      let panel = document.createElement("div");
      panel.id = "typerSettingsPanel", applyStyles(panel, styles.settingsPanel), panel.style.display = "none", makeDraggable(panel);
      let header = document.createElement("div");
      applyStyles(header, {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "10px"
      });
      let title = document.createElement("h3");
      title.textContent = "Typer Settings", title.style.margin = "0", title.style.color = "#61dafb", title.style.fontSize = "14px", header.appendChild(title);
      let resetBtn = document.createElement("button");
      return resetBtn.textContent = "\u21BA", resetBtn.title = "Reset to defaults", applyStyles(resetBtn, {
        ...styles.button,
        padding: "2px 6px",
        fontSize: "14px",
        marginLeft: "8px",
        backgroundColor: "transparent"
      }), resetBtn.onmouseenter = () => {
        resetBtn.style.backgroundColor = "rgba(97, 218, 251, 0.2)";
      }, resetBtn.onmouseleave = () => {
        resetBtn.style.backgroundColor = "transparent";
      }, resetBtn.onclick = () => {
        Object.assign(TYPER_CONFIG, JSON.parse(JSON.stringify({
          baseDelay: 60,
          distanceMultiplier: 12.5,
          minDelay: 15,
          delayVariation: 0.2,
          typoChance: 2,
          typoNoticeDelay: { mean: 250, stdDev: 60 },
          typoBackspaceDelay: { mean: 100, stdDev: 40 },
          typoRecoveryDelay: { mean: 200, stdDev: 50 }
        }))), saveSettings(), refreshSettingsPanel(panel);
      }, header.appendChild(resetBtn), panel.appendChild(header), panel.appendChild(createSettingInput("Base Delay (ms)", "baseDelay", TYPER_CONFIG.baseDelay, 0, 100, 1)), panel.appendChild(createSettingInput("Distance Multiplier", "distanceMultiplier", TYPER_CONFIG.distanceMultiplier, 0, 20, 0.1)), panel.appendChild(createSettingInput("Minimum Delay (ms)", "minDelay", TYPER_CONFIG.minDelay, 0, 50, 1)), panel.appendChild(createSettingInput("Delay Variation", "delayVariation", TYPER_CONFIG.delayVariation, 0, 1, 0.01)), panel.appendChild(createSettingInput("Typo Chance (%)", "typoChance", TYPER_CONFIG.typoChance, 0, 10, 0.1)), panel.appendChild(createSettingInput("Notice Delay (ms)", "typoNoticeDelay.mean", TYPER_CONFIG.typoNoticeDelay.mean, 0, 1e3, 10)), panel.appendChild(createSettingInput("Notice Variation", "typoNoticeDelay.stdDev", TYPER_CONFIG.typoNoticeDelay.stdDev, 0, 200, 5)), panel.appendChild(createSettingInput("Backspace Delay (ms)", "typoBackspaceDelay.mean", TYPER_CONFIG.typoBackspaceDelay.mean, 0, 500, 10)), panel.appendChild(createSettingInput("Backspace Variation", "typoBackspaceDelay.stdDev", TYPER_CONFIG.typoBackspaceDelay.stdDev, 0, 100, 5)), panel.appendChild(createSettingInput("Recovery Delay (ms)", "typoRecoveryDelay.mean", TYPER_CONFIG.typoRecoveryDelay.mean, 0, 500, 10)), panel.appendChild(createSettingInput("Recovery Variation", "typoRecoveryDelay.stdDev", TYPER_CONFIG.typoRecoveryDelay.stdDev, 0, 100, 5)), document.body.appendChild(panel), panel;
    }
    function createSettingInput(labelText, configPath, initialValue, min, max, step) {
      let group = document.createElement("div");
      group.className = "settingsGroup", applyStyles(group, styles.settingsGroup);
      let labelEl = document.createElement("label");
      labelEl.textContent = labelText, applyStyles(labelEl, styles.settingsLabel), group.appendChild(labelEl);
      let inputGroup = document.createElement("div");
      applyStyles(inputGroup, styles.settingsInputGroup);
      let slider = document.createElement("input");
      slider.type = "range", slider.min = min, slider.max = max, slider.step = step, slider.value = initialValue, applyStyles(slider, styles.settingsSlider);
      let numericInput = document.createElement("input");
      numericInput.type = "number", numericInput.value = initialValue, numericInput.min = min, numericInput.max = max, numericInput.step = step, applyStyles(numericInput, styles.settingsInput);
      let updateValue = (val) => {
        let keys = configPath.split("."), target = TYPER_CONFIG;
        for (let i = 0; i < keys.length - 1; i++)
          target = target[keys[i]];
        target[keys[keys.length - 1]] = parseFloat(val), slider.value = val, numericInput.value = val, saveSettings();
      };
      return slider.addEventListener("input", () => updateValue(slider.value)), numericInput.addEventListener("change", () => updateValue(numericInput.value)), inputGroup.appendChild(slider), inputGroup.appendChild(numericInput), group.appendChild(inputGroup), group;
    }
    function refreshSettingsPanel(panel) {
      panel.querySelectorAll(".settingsGroup").forEach((group) => {
        let label = group.querySelector("label").textContent, slider = group.querySelector('input[type="range"]'), numericInput = group.querySelector('input[type="number"]'), path = {
          "Base Delay (ms)": "baseDelay",
          "Distance Multiplier": "distanceMultiplier",
          "Minimum Delay (ms)": "minDelay",
          "Delay Variation": "delayVariation",
          "Typo Chance (%)": "typoChance",
          "Notice Delay (ms)": "typoNoticeDelay.mean",
          "Notice Variation": "typoNoticeDelay.stdDev",
          "Backspace Delay (ms)": "typoBackspaceDelay.mean",
          "Backspace Variation": "typoBackspaceDelay.stdDev",
          "Recovery Delay (ms)": "typoRecoveryDelay.mean",
          "Recovery Variation": "typoRecoveryDelay.stdDev"
        }[label];
        if (!path) return;
        let parts = path.split("."), val = TYPER_CONFIG;
        for (let p of parts)
          val = val[p];
        slider.value = val, numericInput.value = val;
      });
    }
    window.BPS.createSettingsPanel = createSettingsPanel, window.BPS.refreshSettingsPanel = refreshSettingsPanel;
  })();

  // src/ui/suggester.js
  window.BPS = window.BPS || {};
  (function() {
    "use strict";
    let styles = window.BPS.styles, applyStyles = window.BPS.applyStyles, dictionaries = window.BPS.dictionaries, simulateTyping = window.BPS.simulateTyping, isPlayerTurn = window.BPS.isPlayerTurn, currentDictionary = "20k", currentSort = { method: "frequency", direction: "desc" }, letterScores = {
      e: 1,
      t: 2,
      a: 3,
      o: 4,
      i: 5,
      n: 6,
      s: 7,
      r: 8,
      h: 9,
      d: 10,
      l: 11,
      u: 12,
      c: 13,
      m: 14,
      f: 15,
      y: 16,
      w: 17,
      g: 18,
      p: 19,
      b: 20,
      v: 21,
      k: 22,
      x: 23,
      q: 24,
      j: 25,
      z: 26
    };
    function calculateRarityScore(word) {
      return word.toLowerCase().split("").reduce((score, letter) => score + (letterScores[letter] || 13), 0);
    }
    function sortMatches(matches) {
      let { method, direction } = currentSort;
      method === "frequency" && !dictionaries[currentDictionary].hasFrequency && (method = "length");
      let sortFns = {
        frequency: (a, b) => b.freq - a.freq,
        length: (a, b) => b.word.length - a.word.length,
        rarity: (a, b) => calculateRarityScore(b.word) - calculateRarityScore(a.word)
      }, sortFn = sortFns[method] || sortFns.length;
      return matches.sort(direction === "desc" ? sortFn : (a, b) => -sortFn(a, b)), matches;
    }
    function suggestWords(syllable) {
      let resultsDiv = document.getElementById("bombPartyWordSuggesterResults");
      if (!resultsDiv) return;
      if (!syllable) {
        resultsDiv.textContent = "(Waiting for syllable...)";
        return;
      }
      let dictObj = dictionaries[currentDictionary];
      if (!dictObj.words.length) {
        resultsDiv.textContent = "Dictionary not ready yet...";
        return;
      }
      let lower = syllable.toLowerCase(), matches = dictObj.words.filter((e) => e.word.toLowerCase().includes(lower));
      if (!matches.length) {
        resultsDiv.textContent = "No suggestions found.";
        return;
      }
      sortMatches(matches);
      let ul = document.createElement("ul");
      applyStyles(ul, styles.resultsList), matches.slice(0, 15).forEach(({ word }) => {
        let li = document.createElement("li");
        applyStyles(li, styles.resultsItem), li.onmouseenter = () => {
          isPlayerTurn() ? applyStyles(li, styles.resultsItemHover) : applyStyles(li, styles.resultsItemDisabled);
        }, li.onmouseleave = () => {
          applyStyles(li, { backgroundColor: "transparent" });
        }, li.onclick = () => {
          isPlayerTurn() && simulateTyping(word);
        };
        let idx = word.toLowerCase().indexOf(lower);
        if (idx >= 0) {
          let before = word.slice(0, idx), match = word.slice(idx, idx + lower.length), after = word.slice(idx + lower.length);
          li.innerHTML = `${before}<span style="color:${styles.colors.highlight}">${match}</span>${after}`;
        } else
          li.textContent = word;
        ul.appendChild(li);
      }), resultsDiv.innerHTML = "", resultsDiv.appendChild(ul);
    }
    function createDictionarySizeSelector() {
      let container = document.createElement("div");
      return applyStyles(container, styles.sizeSelector), ["5k", "20k", "273k"].forEach((dictSize) => {
        let btn = document.createElement("button");
        btn.textContent = dictSize, applyStyles(btn, styles.button), btn.onclick = () => {
          if (!dictionaries[dictSize].words.length) return;
          currentDictionary = dictSize, [...container.querySelectorAll("button")].forEach((b) => {
            applyStyles(b, styles.button);
          }), applyStyles(btn, { ...styles.button, ...styles.activeButton }), currentSort.method === "frequency" && !dictionaries[dictSize].hasFrequency && (currentSort.method = "length", currentSort.direction = "desc");
          let sEl = document.querySelector(".syllable");
          sEl && suggestWords(sEl.textContent.trim());
        }, btn.onmousedown = (e) => e.stopPropagation(), container.appendChild(btn);
      }), container;
    }
    function createSortControls() {
      let sortControls = document.createElement("div");
      return applyStyles(sortControls, styles.sortControls), Object.entries({
        frequency: "Freq",
        length: "Len",
        rarity: "Rare"
      }).forEach(([method, label]) => {
        let btn = document.createElement("button");
        btn.textContent = label + " \u2191", applyStyles(btn, styles.sortButton);
        let isAscending = !0;
        btn.onclick = () => {
          if (method === "frequency" && !dictionaries[currentDictionary].hasFrequency)
            return;
          currentSort.method === method ? isAscending = !isAscending : isAscending = !0, currentSort.method = method, currentSort.direction = isAscending ? "desc" : "asc", [...sortControls.querySelectorAll("button")].forEach((b) => {
            applyStyles(b, styles.sortButton), b.textContent = b.textContent.replace(/[↑↓]/, "\u2191");
          }), applyStyles(btn, { ...styles.sortButton, ...styles.activeSortButton }), btn.textContent = `${label} ${isAscending ? "\u2193" : "\u2191"}`;
          let sEl = document.querySelector(".syllable");
          sEl && suggestWords(sEl.textContent.trim());
        }, btn.onmousedown = (e) => e.stopPropagation(), sortControls.appendChild(btn);
      }), sortControls;
    }
    function getCurrentDictionary() {
      return currentDictionary;
    }
    function getCurrentSort() {
      return currentSort;
    }
    window.BPS.suggestWords = suggestWords, window.BPS.createDictionarySizeSelector = createDictionarySizeSelector, window.BPS.createSortControls = createSortControls, window.BPS.getCurrentDictionary = getCurrentDictionary, window.BPS.getCurrentSort = getCurrentSort;
  })();

  // src/ui/main.js
  window.BPS = window.BPS || {};
  (function() {
    "use strict";
    let styles = window.BPS.styles, applyStyles = window.BPS.applyStyles, setupDraggableResize = window.BPS.setupDraggableResize, createSettingsPanel = window.BPS.createSettingsPanel, createDictionarySizeSelector = window.BPS.createDictionarySizeSelector, createSortControls = window.BPS.createSortControls;
    function createUI() {
      let panel = document.createElement("div");
      panel.id = "bombPartyWordSuggesterPanel", applyStyles(panel, styles.panel), setupDraggableResize(panel);
      let content = document.createElement("div");
      content.id = "bombPartyWordSuggesterContent", panel.appendChild(content);
      let sizeSelector = createDictionarySizeSelector();
      content.appendChild(sizeSelector);
      let sortControls = createSortControls();
      content.appendChild(sortControls);
      let resultsDiv = document.createElement("div");
      resultsDiv.id = "bombPartyWordSuggesterResults", applyStyles(resultsDiv, styles.resultsDiv), resultsDiv.textContent = "(Waiting for syllable...)", content.appendChild(resultsDiv);
      let settingsPanel = createSettingsPanel(), settingsButton = document.createElement("button");
      settingsButton.textContent = "\u2699\uFE0F", applyStyles(settingsButton, styles.settingsButton), settingsButton.onclick = () => {
        settingsPanel.style.display = settingsPanel.style.display === "none" ? "block" : "none";
      }, settingsButton.onmousedown = (e) => e.stopPropagation(), panel.appendChild(settingsButton), document.body.appendChild(panel);
      let dictButtons = sizeSelector.querySelectorAll("button");
      dictButtons[1] && applyStyles(dictButtons[1], { ...styles.button, ...styles.activeButton });
      let sortButtons = sortControls.querySelectorAll("button");
      sortButtons[0] && (applyStyles(sortButtons[0], { ...styles.sortButton, ...styles.activeSortButton }), sortButtons[0].textContent = "Freq \u2193");
    }
    function initScript() {
      createUI(), window.BPS.setupSyllableObserver();
    }
    window.BPS.initScript = initScript;
  })();

  // src/ui/observer.js
  window.BPS = window.BPS || {};
  (function() {
    "use strict";
    let syllableObserver = null, suggestWords = window.BPS.suggestWords;
    function setupSyllableObserver() {
      if (syllableObserver) return;
      syllableObserver = new MutationObserver((mutations) => {
        for (let m of mutations)
          if (m.type === "childList" || m.type === "characterData") {
            let text = m.target.textContent.trim();
            text && suggestWords(text);
          }
      });
      function waitForSyllable() {
        let el = document.querySelector(".syllable");
        el ? (syllableObserver.observe(el, { childList: !0, characterData: !0, subtree: !0 }), el.textContent.trim() && suggestWords(el.textContent.trim())) : setTimeout(waitForSyllable, 1e3);
      }
      waitForSyllable();
    }
    window.BPS.setupSyllableObserver = setupSyllableObserver;
  })();

  // src/index.js
  (function() {
    "use strict";
    typeof window.BPS < "u" && window.BPS.loadAllDictionaries().then(() => {
      window.BPS.initScript();
    });
  })();
})();

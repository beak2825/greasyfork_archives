// ==UserScript==
// @name         Maxroll Text Extractor with Selector Lock & Shortcut Config
// @namespace    http://tampermonkey.net/
// @version      2025.07.15.3
// @description  Extract text on maxroll.gg with adjustable hierarchy, selector locking, persistent settings, and customizable Ctrl+Letter shortcut.
// @author       You
// @match        *://maxroll.gg/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543444/Maxroll%20Text%20Extractor%20with%20Selector%20Lock%20%20Shortcut%20Config.user.js
// @updateURL https://update.greasyfork.org/scripts/543444/Maxroll%20Text%20Extractor%20with%20Selector%20Lock%20%20Shortcut%20Config.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const wrapperId = "__zhizi_overlay__";
    const timerKey = "__zhizi_html_preview_timer__";
    const dataSetKey = "__zhizi_found_texts__";
    const targetElementKey = "__zhizi_target_element__";
    const lastElementKey = "__zhizi_last_extracted__";

    const storeKeyLevel = "__zhizi_level_store__";
    const storeKeyShortcut = "__zhizi_shortcut_store__";
    const storeKeyPosition = "__zhizi_position_store__"; // -- 新增存储位置

    const intervalMs = 500;

    // Utility: Generate a full CSS selector path to uniquely select an element
    // Source inspired by https://stackoverflow.com/questions/3620116/how-to-get-the-css-path-of-an-element
    function getCssPath(el) {
        if (!(el instanceof Element)) return '';
        let path = [];
        while (el && el.nodeType === Node.ELEMENT_NODE) {
            let selector = el.nodeName.toLowerCase();
            if (el.id) {
                selector += '#' + CSS.escape(el.id);
                path.unshift(selector);
                break; // id is unique in page
            } else {
                // count siblings with same tag
                let sibling = el;
                let nth = 1;
                while ((sibling = sibling.previousElementSibling) != null) {
                    if (sibling.nodeName.toLowerCase() === selector) nth++;
                }
                if (nth > 1) selector += `:nth-of-type(${nth})`;
            }
            path.unshift(selector);
            el = el.parentElement;
        }
        return path.join(" > ");
    }

    // Utility: Get short selector: tag + (#id or .classes)
    function getShortSelector(el) {
        if (!(el instanceof Element)) return '';
        const tag = el.tagName.toLowerCase();
        if (el.id) return tag + '#' + CSS.escape(el.id);
        let classNames = Array.from(el.classList)
            .filter(c => c.trim().length > 0)
            .map(c => '.' + CSS.escape(c))
            .join('');
        return tag + classNames;
    }

    // Create main UI overlay if not exists
    let wrapper = document.getElementById(wrapperId);
    if (!wrapper) {
        wrapper = document.createElement("div");
        wrapper.id = wrapperId;
        wrapper.style.cssText = `
          position: fixed;
          top: 10px;
          left: 10px;
          z-index: 2147483647;
          background: #1e1e1e;
          color: #ddd;
          border: 1px solid #555;
          box-shadow: 0 0 10px rgba(0,0,0,0.7);
          padding: 12px;
          max-width: 440px;
          width: 420px;
          max-height: 90vh;
          overflow: hidden;
          font-family: monospace;
          font-size: 14px;
          border-radius: 8px;
          user-select: none;
        `;

        // Level input box
        const levelInput = document.createElement("input");
        levelInput.type = "number";
        levelInput.min = "1";
        levelInput.max = "10";
        levelInput.placeholder = "Hierarchy Level";
        levelInput.style.cssText = `
          width: 100%;
          padding: 6px 8px;
          margin-bottom: 8px;
          font-size: 14px;
          background: #2c2c2c;
          color: #fff;
          border: 1px solid #444;
          border-radius: 4px;
        `;
        levelInput.id = "__zhizi_level__";

        // Shortcut config container
        const shortcutContainer = document.createElement("div");
        shortcutContainer.style.cssText = `
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #ddd;
          user-select: none;
        `;

        // Ctrl checkbox
        const ctrlCheckbox = document.createElement("input");
        ctrlCheckbox.type = "checkbox";
        ctrlCheckbox.id = "__zhizi_ctrl_check__";

        const ctrlLabel = document.createElement("label");
        ctrlLabel.htmlFor = "__zhizi_ctrl_check__";
        ctrlLabel.textContent = "Ctrl";

        // Letter dropdown (A-Z)
        const letterSelect = document.createElement("select");
        letterSelect.id = "__zhizi_letter_select__";
        letterSelect.style.cssText = `
          background: #2c2c2c;
          color: #fff;
          border: 1px solid #444;
          border-radius: 4px;
          padding: 2px 6px;
          font-size: 14px;
          user-select: none;
        `;

        for(let i=65; i<=90; i++) {
            const opt = document.createElement("option");
            opt.value = String.fromCharCode(i).toLowerCase();
            opt.textContent = String.fromCharCode(i);
            letterSelect.appendChild(opt);
        }

        shortcutContainer.appendChild(ctrlCheckbox);
        shortcutContainer.appendChild(ctrlLabel);
        shortcutContainer.appendChild(letterSelect);

        // Selector lock checkbox
        const lockContainer = document.createElement("div");
        lockContainer.style.cssText = "margin-bottom:8px; font-size:14px; user-select:none; color:#ddd;";
        const lockCheckbox = document.createElement("input");
        lockCheckbox.type = "checkbox";
        lockCheckbox.id = "__zhizi_lock_selector__";
        const lockLabel = document.createElement("label");
        lockLabel.htmlFor = "__zhizi_lock_selector__";
        lockLabel.textContent = "Lock selector (stop following mouse)";
        lockLabel.style.marginLeft = "6px";
        lockContainer.appendChild(lockCheckbox);
        lockContainer.appendChild(lockLabel);

        // -- 新增位置选择相关开始 --
        // Position select container
        const positionContainer = document.createElement("div");
        positionContainer.style.cssText = `
          margin-bottom: 8px;
          font-size: 14px;
          color: #ddd;
          user-select: none;
          display: flex;
          align-items: center;
          gap: 6px;
        `;
        const positionLabel = document.createElement("label");
        positionLabel.textContent = "Overlay position:";

        const positionSelect = document.createElement("select");
        positionSelect.id = "__zhizi_position_select__";
        positionSelect.style.cssText = `
          background: #2c2c2c;
          color: #fff;
          border: 1px solid #444;
          border-radius: 4px;
          padding: 2px 6px;
          font-size: 14px;
          user-select: none;
        `;
        const positions = [
            {value: "top-left", text: "左上"},
            {value: "top-right", text: "右上"},
            {value: "bottom-left", text: "左下"},
            {value: "bottom-right", text: "右下"},
        ];
        positions.forEach(pos => {
            const opt = document.createElement("option");
            opt.value = pos.value;
            opt.textContent = pos.text;
            positionSelect.appendChild(opt);
        });
        positionContainer.appendChild(positionLabel);
        positionContainer.appendChild(positionSelect);
        // -- 新增位置选择相关结束 --

        // Selector inputs container
        const selectorInputs = document.createElement("div");
        selectorInputs.style.cssText = `
          margin-bottom: 8px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        `;

        // Full path selector input (readonly)
        const fullPathInput = document.createElement("input");
        fullPathInput.type = "text";
        fullPathInput.readOnly = true;
        fullPathInput.placeholder = "Full CSS Path Selector (copyable)";
        fullPathInput.style.cssText = `
          width: 100%;
          padding: 6px 8px;
          font-size: 13px;
          background: #2c2c2c;
          color: #eee;
          border: 1px solid #444;
          border-radius: 4px;
          user-select: text;
        `;

        // Short selector input (readonly)
        const shortSelectorInput = document.createElement("input");
        shortSelectorInput.type = "text";
        shortSelectorInput.readOnly = true;
        shortSelectorInput.placeholder = "Short Selector (tag#id or tag.class)";
        shortSelectorInput.style.cssText = `
          width: 100%;
          padding: 6px 8px;
          font-size: 13px;
          background: #2c2c2c;
          color: #eee;
          border: 1px solid #444;
          border-radius: 4px;
          user-select: text;
        `;

        selectorInputs.appendChild(fullPathInput);
        selectorInputs.appendChild(shortSelectorInput);

        // Output textarea
        const output = document.createElement("textarea");
        output.id = "__zhizi_output__";
        output.readOnly = true;
        output.style.cssText = `
          width: 100%;
          height: 280px;
          padding: 10px;
          background: #2a2a2a;
          color: #f0f0f0;
          border: 1px solid #444;
          border-radius: 4px;
          resize: vertical;
          white-space: pre-wrap;
          word-break: break-word;
          user-select: text;
        `;

        wrapper.appendChild(levelInput);
        wrapper.appendChild(shortcutContainer);
        wrapper.appendChild(lockContainer);
        wrapper.appendChild(positionContainer);  // -- 新增位置选择容器插入 --
        wrapper.appendChild(selectorInputs);
        wrapper.appendChild(output);
        document.body.appendChild(wrapper);
    }

    // Elements refs
    const levelInputEl = document.getElementById("__zhizi_level__");
    const outputEl = document.getElementById("__zhizi_output__");
    const ctrlCheckboxEl = document.getElementById("__zhizi_ctrl_check__");
    const letterSelectEl = document.getElementById("__zhizi_letter_select__");
    const lockCheckboxEl = document.getElementById("__zhizi_lock_selector__");
    const fullPathInputEl = wrapper.querySelector("input[placeholder^='Full CSS']");
    const shortSelectorInputEl = wrapper.querySelector("input[placeholder^='Short Selector']");
    // 新增位置选择元素引用
    const positionSelectEl = document.getElementById("__zhizi_position_select__");

    // Load stored values or defaults
    const storedLevel = parseInt(localStorage.getItem(storeKeyLevel));
    if (storedLevel && storedLevel >= 1 && storedLevel <= 10) {
        levelInputEl.value = storedLevel;
    } else {
        levelInputEl.value = "3";
    }

    // Shortcut defaults and load
    let shortcut = { ctrl: true, letter: "q" };
    try {
        const storedShortcut = JSON.parse(localStorage.getItem(storeKeyShortcut));
        if (storedShortcut && typeof storedShortcut.ctrl === "boolean" && /^[a-z]$/.test(storedShortcut.letter)) {
            shortcut = storedShortcut;
        }
    } catch(e) {}

    ctrlCheckboxEl.checked = shortcut.ctrl;
    letterSelectEl.value = shortcut.letter;

    // -- 新增加载位置设置 --
    let position = localStorage.getItem(storeKeyPosition);
    if (!position || !["top-left", "top-right", "bottom-left", "bottom-right"].includes(position)) {
        position = "top-left"; // 默认左上
    }
    positionSelectEl.value = position;

    // 根据position调整wrapper样式
    function updateWrapperPosition(pos) {
        wrapper.style.top = "";
        wrapper.style.left = "";
        wrapper.style.right = "";
        wrapper.style.bottom = "";

        switch(pos) {
            case "top-left":
                wrapper.style.top = "10px";
                wrapper.style.left = "10px";
                break;
            case "top-right":
                wrapper.style.top = "10px";
                wrapper.style.right = "10px";
                break;
            case "bottom-left":
                wrapper.style.bottom = "10px";
                wrapper.style.left = "10px";
                break;
            case "bottom-right":
                wrapper.style.bottom = "10px";
                wrapper.style.right = "10px";
                break;
        }
    }
    updateWrapperPosition(position);

    // 监听位置选择变化，保存并更新位置
    positionSelectEl.addEventListener("change", () => {
        const val = positionSelectEl.value;
        if (["top-left", "top-right", "bottom-left", "bottom-right"].includes(val)) {
            localStorage.setItem(storeKeyPosition, val);
            updateWrapperPosition(val);
            console.log(`[Position] Updated overlay position to ${val}`);
        }
    });

    // Save and refresh on level change
    levelInputEl.addEventListener("change", () => {
        let val = parseInt(levelInputEl.value);
        if (isNaN(val) || val < 1) val = 1;
        if (val > 10) val = 10;
        levelInputEl.value = val;
        localStorage.setItem(storeKeyLevel, val);
        location.reload();
    });

    // Save shortcut on change and update runtime variable
    function saveShortcut() {
        shortcut.ctrl = ctrlCheckboxEl.checked;
        shortcut.letter = letterSelectEl.value;
        localStorage.setItem(storeKeyShortcut, JSON.stringify(shortcut));
        console.log(`[Shortcut] Updated to Ctrl:${shortcut.ctrl} + ${shortcut.letter.toUpperCase()}`);
    }
    ctrlCheckboxEl.addEventListener("change", saveShortcut);
    letterSelectEl.addEventListener("change", saveShortcut);

    // Initialize globals
    window[dataSetKey] = window[dataSetKey] || [];
    window[targetElementKey] = null;
    window[lastElementKey] = null;

    // Clear previous timer if any
    if (window[timerKey]) {
        clearInterval(window[timerKey]);
        console.log("[Restarted] Previous timer cleared.");
    }

    // Recursive text extraction from element
    function extractTextRecursively(el, outputSet) {
        if (!el || !el.childNodes) return;
        for (const node of el.childNodes) {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.nodeValue.trim().replace(/\n+/g, '\n');
                if (text && !outputSet.includes(text)) {
                    outputSet.push(text);
                    outputEl.value += (outputEl.value ? "\n" : "") + text;
                    console.log(`[Text] ${text}`);
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                extractTextRecursively(node, outputSet);
            }
        }
    }

    // Track hovered element
    let hoveredElement = null;
    document.addEventListener("mousemove", (e) => {
        if (!lockCheckboxEl.checked) hoveredElement = e.target;
    });

    // Current locked selector path (string) or null
    let lockedSelectorPath = null;

    // On lock checkbox manual uncheck -> clear locked selector & resume hover tracking
    lockCheckboxEl.addEventListener("change", () => {
        if (!lockCheckboxEl.checked) {
            lockedSelectorPath = null;
            // Reset highlight to hovered element
            if (window[targetElementKey]) {
                window[targetElementKey].style.outline = "";
                window[targetElementKey] = null;
            }
        }
    });

    // Highlight element helper
    function highlightElement(el) {
        if (!el) return;
        if (window[targetElementKey] && window[targetElementKey] !== el) {
            window[targetElementKey].style.outline = "";
        }
        window[targetElementKey] = el;
        el.style.outline = "2px solid red";
        console.log(`[Hover Target] ${el.tagName}`);
    }

    // Every 500ms, find element to highlight according to locked selector or hovered + level
    window[timerKey] = setInterval(() => {
        let el = null;

        if (lockCheckboxEl.checked && lockedSelectorPath) {
            try {
                el = document.querySelector(lockedSelectorPath);
            } catch {
                el = null;
            }
        } else {
            if (!hoveredElement) return;
            let level = parseInt(levelInputEl.value) || 1;
            el = hoveredElement;
            for (let i = 0; i < level && el?.parentElement; i++) {
                el = el.parentElement;
            }
        }

        if (el && el !== window[targetElementKey]) {
            highlightElement(el);

            // Update selector input fields
            fullPathInputEl.value = getCssPath(el);
            shortSelectorInputEl.value = getShortSelector(el);
        } else if (el) {
            // If element same as current, update selectors anyway (in case changed)
            fullPathInputEl.value = getCssPath(el);
            shortSelectorInputEl.value = getShortSelector(el);
        }
    }, intervalMs);

    // Listen for shortcut to extract text from target element, and auto-lock selector if needed
    document.addEventListener("keydown", (e) => {
        if (
            e.key.toLowerCase() === shortcut.letter &&
            (!shortcut.ctrl || (shortcut.ctrl && e.ctrlKey))
        ) {
            e.preventDefault();

            const el = window[targetElementKey];
            if (!el) return;

            // If lock checkbox not checked, auto check and lock selector on current element
            if (!lockCheckboxEl.checked) {
                lockCheckboxEl.checked = true;
                lockedSelectorPath = fullPathInputEl.value || getCssPath(el);
                localStorage.setItem(storeKeyLevel, levelInputEl.value); // save level for good measure
                console.log("[Lock] Auto-locked selector on shortcut press");
            }

            if (el !== window[lastElementKey]) {
                window[dataSetKey] = [];
                outputEl.value = "";
                window[lastElementKey] = el;
                console.log("[New Element] Cleared output and tracking");
            }

            extractTextRecursively(el, window[dataSetKey]);
        }
    });

})();

// ==UserScript==
// @name         Developer Console(Toggle with Ctrl+Q)
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  A draggable, resizable console panel with a Run button for executing JS on any page; toggled with Ctrl+Q
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545057/Developer%20Console%28Toggle%20with%20Ctrl%2BQ%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545057/Developer%20Console%28Toggle%20with%20Ctrl%2BQ%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Create console panel
    const panel = document.createElement("div");
    panel.style.position = "fixed";
    panel.style.bottom = "10px";
    panel.style.right = "10px";
    panel.style.width = "350px";
    panel.style.height = "260px";
    panel.style.background = "#111";
    panel.style.color = "#0f0";
    panel.style.fontFamily = "monospace";
    panel.style.fontSize = "12px";
    panel.style.border = "2px solid #0f0";
    panel.style.zIndex = "999999";
    panel.style.display = "none";  // Start hidden
    panel.style.flexDirection = "column";
    panel.style.resize = "both";
    panel.style.overflow = "hidden";

    // Header bar (draggable)
    const header = document.createElement("div");
    header.innerText = "🔍 Developer Console V3.2 (created by Jayden)";
    header.style.background = "#222";
    header.style.padding = "5px";
    header.style.cursor = "move";
    header.style.userSelect = "none";

    // Output area
    const output = document.createElement("div");
    output.style.flex = "1";
    output.style.overflowY = "auto";
    output.style.padding = "5px";

    // Input area
    const input = document.createElement("textarea");
    input.placeholder = "Enter JavaScript code... (Shift+Enter for new line)";
    input.style.width = "100%";
    input.style.height = "60px";
    input.style.border = "none";
    input.style.outline = "none";
    input.style.padding = "5px";
    input.style.background = "#222";
    input.style.color = "#0f0";
    input.style.fontFamily = "monospace";
    input.style.fontSize = "12px";
    input.style.resize = "none";

    // Run button
    const runBtn = document.createElement("button");
    runBtn.innerText = "▶ Run Code";
    runBtn.style.background = "#0f0";
    runBtn.style.color = "#000";
    runBtn.style.border = "none";
    runBtn.style.padding = "5px";
    runBtn.style.cursor = "pointer";
    runBtn.style.fontWeight = "bold";
    runBtn.style.fontSize = "12px";

    // Execute code on button click
    runBtn.addEventListener("click", () => {
        executeCode(input.value);
    });

    // Execute on Enter key (but allow Shift+Enter for new line)
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            executeCode(input.value);
        }
    });

    // Function to execute code
    function executeCode(code) {
        try {
            let result = eval(code);
            output.innerHTML += `<div>> ${code}</div>`;
            output.innerHTML += `<div style="color:#0ff;">${result}</div>`;
        } catch (err) {
            output.innerHTML += `<div style="color:red;">Error: ${err}</div>`;
        }
        input.value = "";
        output.scrollTop = output.scrollHeight;
    }

    // Dragging logic
    let isDragging = false;
    let offsetX, offsetY;
    header.addEventListener("mousedown", (e) => {
        isDragging = true;
        offsetX = e.clientX - panel.offsetLeft;
        offsetY = e.clientY - panel.offsetTop;
        document.addEventListener("mousemove", drag);
        document.addEventListener("mouseup", stopDrag);
    });

    function drag(e) {
        if (isDragging) {
            panel.style.left = (e.clientX - offsetX) + "px";
            panel.style.top = (e.clientY - offsetY) + "px";
            panel.style.bottom = "unset";
            panel.style.right = "unset";
        }
    }
    function stopDrag() {
        isDragging = false;
        document.removeEventListener("mousemove", drag);
        document.removeEventListener("mouseup", stopDrag);
    }

    // Capture console.log
    const originalLog = console.log;
    console.log = function (...args) {
        output.innerHTML += `<div style="color:#0f0;">LOG: ${args.join(" ")}</div>`;
        output.scrollTop = output.scrollHeight;
        originalLog.apply(console, args);
    };

    // Append elements
    const controls = document.createElement("div");
    controls.style.display = "flex";
    controls.appendChild(runBtn);

    panel.appendChild(header);
    panel.appendChild(output);
    panel.appendChild(input);
    panel.appendChild(controls);
    document.body.appendChild(panel);

    // Listen for Ctrl+Q to toggle console panel
    window.addEventListener("keydown", (e) => {
        if (e.ctrlKey && !e.shiftKey && e.code === "KeyQ") {
            e.preventDefault();
            if (panel.style.display === "none") {
                panel.style.display = "flex";
                input.focus();
            } else {
                panel.style.display = "none";
            }
        }
    });
})();

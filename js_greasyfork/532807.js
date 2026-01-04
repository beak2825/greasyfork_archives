// ==UserScript==
// @name         T3 Chat Enhanced UI with Code Execution
// @namespace    http://tampermonkey.net/
// @version      3.4
// @description  Adds a zoomed-out preview scrollbar, code block list, download functionality, and code execution to T3 Chat
// @author       T3 Chat
// @license      MIT
// @match        https://t3.chat/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532807/T3%20Chat%20Enhanced%20UI%20with%20Code%20Execution.user.js
// @updateURL https://update.greasyfork.org/scripts/532807/T3%20Chat%20Enhanced%20UI%20with%20Code%20Execution.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const C = {
    scale: 0.2,
    thumbHeightVh: 10,
    scrollbarOffset: 20,
    throttleDelay: 3000,
    codeListWidth: 300,
    codeListOffset: 20,
  };
  const EXT = {
    javascript: ".js", js: ".js", typescript: ".ts", ts: ".ts", python: ".py", py: ".py", java: ".java", csharp: ".cs", c: ".c", cpp: ".cpp", "c++": ".cpp", php: ".php", ruby: ".rb", rust: ".rs", go: ".go", html: ".html", css: ".css", scss: ".scss", sql: ".sql", json: ".json", xml: ".xml", yaml: ".yml", bash: ".sh", shell: ".sh", powershell: ".ps1", markdown: ".md", swift: ".swift", kotlin: ".kt", dart: ".dart", r: ".r", perl: ".pl", lua: ".lua", haskell: ".hs", scala: ".scala", elixir: ".ex", clojure: ".clj", dockerfile: "Dockerfile", makefile: "Makefile", plaintext: ".txt", text: ".txt"
  };
  const COMM = {
    javascript: "//", js: "//", typescript: "//", ts: "//", java: "//", csharp: "//", c: "//", cpp: "//", "c++": "//", go: "//", swift: "//", kotlin: "//", dart: "//", php: "//", python: "#", py: "#", ruby: "#", rust: "//", bash: "#", shell: "#", powershell: "#", r: "#", perl: "#", lua: "--", haskell: "--", sql: "--", elixir: "#", clojure: ";;", scala: "//", scss: "//", css: "/*", html: "<!--", xml: "<!--", yaml: "#", json: "", markdown: "", plaintext: "", text: ""
  };
  // Define runnable language types
  const RUNNABLE = {
    javascript: true,
    js: true,
    html: true
  };
  let state = { lastContentUpdate: 0, elements: {}, observers: {}, codeBlocks: [], codeBlockGroups: [] };
  if (window.t3ChatUICleanup) window.t3ChatUICleanup();

  function el(tag, css, html) {
    const e = document.createElement(tag);
    if (css) e.style.cssText = css;
    if (html) e.innerHTML = html;
    return e;
  }

  function createScrollbar() {
    const s = el("div", `position:fixed;top:0;right:${C.scrollbarOffset}px;width:150px;height:100vh;background:rgba(0,0,0,0.1);overflow:hidden;z-index:1000;`);
    s.id = "t3-chat-preview-scrollbar";
    const pc = el("div", `position:relative;transform:scale(${C.scale});transform-origin:top left;overflow:hidden;pointer-events:none;top:0;`);
    pc.id = "t3-chat-preview-content";
    s.appendChild(pc);
    const t = el("div", `position:absolute;top:0;left:0;width:100%;height:${C.thumbHeightVh}vh;background:rgba(66,135,245,0.5);cursor:grab;`);
    t.id = "t3-chat-preview-thumb";
    s.appendChild(t);
    document.body.appendChild(s);
    t.addEventListener("mousedown", handleThumbDrag);
    s.addEventListener("mousedown", handleScrollbarClick);
    return { scrollbar: s, previewContent: pc, thumb: t };
  }

  function createCodeList() {
    const main = document.querySelector("main");
    if (!main) return { codeList: null, listContainer: null };
    const cl = el("div", `position:relative;top:0;left:20px;width:fit-content;height:auto;background:rgba(0,0,0,0.2);overflow-y:auto;z-index:1000;font-family:system-ui,-apple-system,sans-serif;box-shadow:rgba(0,0,0,0.1) 2px 0px 5px;padding:10px;`);
    cl.id = "t3-chat-code-list";
    cl.appendChild(el("div", `font-size:16px;font-weight:bold;margin-bottom:15px;padding-bottom:8px;border-bottom:1px solid rgba(0,0,0,0.2);color:#fff;`, "Code Blocks"));
    const lc = el("div");
    lc.id = "t3-chat-code-list-container";
    cl.appendChild(lc);
    main.appendChild(cl);
    return { codeList: cl, listContainer: lc };
  }

  function detectLanguage(cb) {
    const p = cb.parentNode, l = p.querySelector(".font-mono");
    if (l) return l.textContent.trim().toLowerCase();
    const c = cb.getAttribute("data-language") || cb.className.match(/language-(\w+)/)?.[1];
    return c ? c.toLowerCase() : "";
  }

  function getFileExtension(l) { return EXT[l.toLowerCase()] || ".txt"; }
  function cleanCodeContent(c) { return c.replace(/^\s*\d+\s*\|/gm, "").trim(); }
  function downloadTextAsFile(f, t) {
    const a = el("a");
    a.href = "data:text/plain;charset=utf-8," + encodeURIComponent(t);
    a.download = f;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // Create a container to display code execution results
  function createResultDisplay() {
    const existingDisplay = document.getElementById("t3-code-execution-result");
    if (existingDisplay) return existingDisplay;

    const display = el("div", `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 400px;
      max-height: 300px;
      background: rgba(0, 0, 0, 0.8);
      color: #fff;
      border-radius: 8px;
      padding: 12px;
      font-family: monospace;
      z-index: 10000;
      overflow: auto;
      display: none;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    `);
    display.id = "t3-code-execution-result";

    const header = el("div", `
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      padding-bottom: 8px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    `, "<span>Code Execution Result</span>");

    const closeBtn = el("button", `
      background: transparent;
      border: none;
      color: #fff;
      cursor: pointer;
      font-size: 14px;
      padding: 2px 6px;
    `, "×");
    closeBtn.onclick = () => { display.style.display = "none"; };
    header.appendChild(closeBtn);

    const content = el("div", `white-space: pre-wrap;`);
    content.id = "t3-code-execution-content";

    display.appendChild(header);
    display.appendChild(content);
    document.body.appendChild(display);

    return display;
  }

  // Execute code safely
  function executeCode(code, language) {
    const resultDisplay = createResultDisplay();
    const resultContent = document.getElementById("t3-code-execution-content");
    resultDisplay.style.display = "block";

    // Capture console output
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalInfo = console.info;

    let output = [];

    // Override console methods
    console.log = (...args) => {
      originalLog.apply(console, args);
      output.push(`<span style="color:#aaffaa;">LOG:</span> ${args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ')}`);
      updateOutput();
    };

    console.error = (...args) => {
      originalError.apply(console, args);
      output.push(`<span style="color:#ffaaaa;">ERROR:</span> ${args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ')}`);
      updateOutput();
    };

    console.warn = (...args) => {
      originalWarn.apply(console, args);
      output.push(`<span style="color:#ffdd99;">WARN:</span> ${args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ')}`);
      updateOutput();
    };

    console.info = (...args) => {
      originalInfo.apply(console, args);
      output.push(`<span style="color:#99ddff;">INFO:</span> ${args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ')}`);
      updateOutput();
    };

    function updateOutput() {
      resultContent.innerHTML = output.join('<br>');
      resultContent.scrollTop = resultContent.scrollHeight;
    }

    resultContent.innerHTML = '<span style="color:#aaaaff;">Executing code...</span>';

    // Special handling for HTML
    if (language === 'html') {
      try {
        // Create a sandbox iframe
        const sandbox = document.createElement('iframe');
        sandbox.style.cssText = 'width:100%;height:200px;border:none;';
        resultContent.innerHTML = '';
        resultContent.appendChild(sandbox);

        // Set the HTML content
        const iframeDocument = sandbox.contentDocument || sandbox.contentWindow.document;
        iframeDocument.open();
        iframeDocument.write(code);
        iframeDocument.close();

        output.push('<span style="color:#aaffaa;">HTML rendered in iframe</span>');
        updateOutput();
      } catch (error) {
        output.push(`<span style="color:#ffaaaa;">ERROR:</span> ${error.message}`);
        updateOutput();
      }
    } else {
      // For JavaScript
      try {
        // Execute the code
        const result = eval(code);

        // Show the return value if any
        if (result !== undefined) {
          let displayResult;
          try {
            displayResult = typeof result === 'object' ?
              JSON.stringify(result, null, 2) :
              String(result);
          } catch (e) {
            displayResult = '[Complex object]';
          }

          output.push(`<span style="color:#aaffff;">RESULT:</span> ${displayResult}`);
        }

        if (output.length === 0) {
          output.push('<span style="color:#aaffaa;">Code executed successfully with no output</span>');
        }
      } catch (error) {
        output.push(`<span style="color:#ffaaaa;">ERROR:</span> ${error.message}`);
      }

      updateOutput();
    }

    // Restore console methods
    setTimeout(() => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
      console.info = originalInfo;
    }, 0);
  }

  // Add run button to a code block element
  function addRunButtonToCodeBlock(pre, language, content) {
    // Check if we already added a run button
    if (pre.querySelector('.t3-run-code-btn')) return;

    // Only add run button for supported languages
    if (!RUNNABLE[language]) return;

    const runBtn = el("button", `
      position: absolute;
      top: 5px;
      right: 5px;
      background: rgba(66, 135, 245, 0.8);
      color: white;
      border: none;
      border-radius: 4px;
      padding: 3px 8px;
      font-size: 12px;
      cursor: pointer;
      opacity: 0.7;
      transition: opacity 0.2s;
      z-index: 10;
    `, "Run");

    runBtn.className = "t3-run-code-btn";
    runBtn.title = "Execute this code in the browser";

    runBtn.addEventListener("mouseover", () => {
      runBtn.style.opacity = "1";
    });

    runBtn.addEventListener("mouseout", () => {
      runBtn.style.opacity = "0.7";
    });

    runBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      executeCode(content, language);
    });

    // Set the code block to relative positioning if not already set
    if (pre.style.position !== "relative") {
      pre.style.position = "relative";
    }

    pre.appendChild(runBtn);
  }

  function findCodeBlocks() {
    const groups = [];
    const seen = new Set();
    // Only search within the original document's log div, not in the preview
    const logDiv = document.querySelector('[role="log"]');
    if (!logDiv) return groups;

    [["Assistant message", "assistant"], ["Your message", "user"]].forEach(([aria, type]) => {
      logDiv.querySelectorAll(`div[aria-label="${aria}"]`).forEach((msg, mi) => {
        const pres = msg.querySelectorAll(".shiki.not-prose");
        if (!pres.length) return;
        const blocks = [];
        pres.forEach((pre, bi) => {
          if (seen.has(pre)) return;
          seen.add(pre);
          const code = pre.querySelector("code");
          if (!code) return;
          const content = cleanCodeContent(code.textContent || "");
          const lines = content.split("\n");
          const lang = detectLanguage(pre), comm = COMM[lang] || "";
          let name = lines[0]?.trim() || `Code Block ${bi + 1}`;
          if (comm && name.startsWith(comm)) name = name.slice(comm.length).trim();
          if (name.length > 20) name = name.slice(0, 17) + "...";
          const ext = getFileExtension(lang);
          if (ext && !name.endsWith(ext)) name += ext;

          // Add run button to the code block in the chat
          addRunButtonToCodeBlock(pre, lang, content);

          blocks.push({ id: `${type}-msg-${mi}-block-${bi}`, name, language: lang, element: pre, content, messageType: type });
        });
        if (blocks.length) groups.push({ messageType: type, messageIndex: mi, blocks });
      });
    });
    return groups;
  }

  function updateCodeList() {
    const { listContainer } = state.elements;
    if (!listContainer) return;
    const groups = findCodeBlocks();
    state.codeBlockGroups = groups;
    state.codeBlocks = groups.flatMap(g => g.blocks);
    listContainer.innerHTML = "";
    if (!groups.length) {
      listContainer.appendChild(el("div", `color:#666;font-style:italic;padding:10px 0;text-align:center;`, "No code blocks found"));
      return;
    }
    groups.forEach(g => {
      listContainer.appendChild(el("div", `font-size:14px;font-weight:bold;margin-top:15px;margin-bottom:8px;padding:5px;border-radius:4px;color:white;background:${g.messageType === "assistant" ? "rgba(66,135,245,0.6)" : "rgba(120,120,120,0.6)"};`, `${g.messageType === "assistant" ? "Assistant" : "User"} Message #${g.messageIndex + 1}`));
      g.blocks.forEach(b => {
        const item = el("div", `display:flex;justify-content:space-between;align-items:center;padding:8px;margin-bottom:8px;background:${b.messageType === "assistant" ? "rgba(0,0,0,0.4)" : "rgba(60,60,60,0.4)"};border-radius:4px;cursor:pointer;transition:background-color 0.2s;border-left:3px solid ${b.messageType === "assistant" ? "rgba(66,135,245,0.8)" : "rgba(180,180,180,0.8)"};`);
        item.addEventListener("mouseover", () => {
          item.style.backgroundColor = b.messageType === "assistant"
            ? "rgba(66,135,245,0.2)"
            : "rgba(120,120,120,0.2)";
        });
        item.addEventListener("mouseout", () => {
          item.style.backgroundColor = b.messageType === "assistant"
            ? "rgba(0,0,0,0.4)"
            : "rgba(60,60,60,0.4)";
        });

        const nameSpan = el("div", `flex-grow:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:14px;`);
        if (b.language) nameSpan.appendChild(el("span", `background:rgba(66,135,245,0.3);color:white;font-size:10px;padding:1px 4px;border-radius:3px;margin-right:5px;`, b.language));
        nameSpan.appendChild(document.createTextNode(b.name));
        const btns = el("div", `display:flex;gap:5px;`);

        // Copy
        const copyBtn = el("button", `background:transparent;border:none;color:rgba(66,135,245,0.8);cursor:pointer;font-size:14px;padding:2px 5px;border-radius:3px;`, `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path></svg>`);
        copyBtn.title = "Copy code";
        copyBtn.onclick = e => {
          e.stopPropagation();
          navigator.clipboard.writeText(b.content).then(() => {
            const o = copyBtn.innerHTML;
            copyBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="green" stroke-width="2"><path d="M20 6L9 17l-5-5"></path></svg>`;
            setTimeout(() => { copyBtn.innerHTML = o; }, 1500);
          });
        };

        // Download
        const dlBtn = el("button", `background:transparent;border:none;color:rgba(66,135,245,0.8);cursor:pointer;font-size:14px;padding:2px 5px;border-radius:3px;`, `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`);
        dlBtn.title = "Download code";
        dlBtn.onclick = e => {
          e.stopPropagation();
          downloadTextAsFile(b.name, b.content);
          const o = dlBtn.innerHTML;
          dlBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="green" stroke-width="2"><path d="M20 6L9 17l-5-5"></path></svg>`;
          setTimeout(() => (dlBtn.innerHTML = o), 1500);
        };

        // Run (only for supported languages)
        if (RUNNABLE[b.language]) {
          const runBtn = el("button", `background:transparent;border:none;color:rgba(66,135,245,0.8);cursor:pointer;font-size:14px;padding:2px 5px;border-radius:3px;`, `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`);
          runBtn.title = "Run code";
          runBtn.onclick = e => {
            e.stopPropagation();
            executeCode(b.content, b.language);
            const o = runBtn.innerHTML;
            runBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="green" stroke-width="2"><path d="M20 6L9 17l-5-5"></path></svg>`;
            setTimeout(() => (runBtn.innerHTML = o), 1500);
          };
          btns.appendChild(runBtn);
        }

        btns.appendChild(copyBtn);
        btns.appendChild(dlBtn);
        item.appendChild(nameSpan);
        item.appendChild(btns);
        item.onclick = () => {
          b.element.scrollIntoView({ behavior: "smooth", block: "center" });
          const o = b.element.style.outline, ob = b.element.style.backgroundColor;
          b.element.style.outline = "3px solid rgba(66,135,245,0.8)";
          b.element.style.backgroundColor = "rgba(66,135,245,0.1)";
          setTimeout(() => {
            b.element.style.outline = o;
            b.element.style.backgroundColor = ob;
          }, 2000);
        };
        listContainer.appendChild(item);
      });
    });
  }

  function updatePreviewContent() {
    const { logDiv, previewContent } = state.elements;
    if (!logDiv || !previewContent) return;
    const now = Date.now();
    if (now - state.lastContentUpdate < C.throttleDelay) return;
    const clone = logDiv.cloneNode(true);
    clone.querySelectorAll("*").forEach(e => { e.style.pointerEvents = "none"; e.style.userSelect = "none"; });
    clone.querySelectorAll(".shiki.not-prose").forEach(e => { e.style.outline = "2px solid #ff9800"; e.style.background = "rgba(255,152,0,0.2)"; e.style.borderRadius = "4px"; });
    previewContent.innerHTML = "";
    previewContent.appendChild(clone);
    previewContent.style.width = logDiv.getBoundingClientRect().width + "px";
    state.lastContentUpdate = now;
  }

  function updateThumbPosition() {
    const { scrollParent, thumb, scrollbar, previewContent } = state.elements;
    if (!scrollParent || !thumb || !scrollbar || !previewContent) return;
    const sh = scrollParent.scrollHeight, ch = scrollParent.clientHeight, st = scrollParent.scrollTop, sbh = scrollbar.offsetHeight, th = (C.thumbHeightVh / 100) * window.innerHeight;
    let tp = (sbh - th) * (st / (sh - ch));
    tp = Math.min(Math.max(0, tp), sbh - th);
    thumb.style.height = th + "px";
    thumb.style.top = tp + "px";
    const tc = tp + th / 2;
    previewContent.style.top = `-${st * C.scale - tc}px`;
  }

  function handleThumbDrag(e) {
    const { scrollParent, thumb, scrollbar, previewContent } = state.elements;
    if (!scrollParent || !thumb || !scrollbar || !previewContent) return;
    const sh = scrollParent.scrollHeight, ch = scrollParent.clientHeight, sbh = scrollbar.offsetHeight, th = (C.thumbHeightVh / 100) * window.innerHeight, sy = e.clientY, st = thumb.offsetTop;
    function drag(ev) {
      const dy = ev.clientY - sy, nt = Math.max(0, Math.min(st + dy, sbh - th));
      thumb.style.top = nt + "px";
      const sp = (nt / (sbh - th)) * (sh - ch);
      scrollParent.scrollTop = sp;
      const tc = nt + th / 2;
      previewContent.style.top = `-${sp * C.scale - tc}px`;
    }
    function stop() {
      document.removeEventListener("mousemove", drag);
      document.removeEventListener("mouseup", stop);
    }
    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", stop);
    e.preventDefault();
  }

  function handleScrollbarClick(e) {
    if (e.target === state.elements.thumb) return;
    const { scrollParent, thumb, scrollbar } = state.elements;
    if (!scrollParent || !thumb || !scrollbar) return;
    const r = scrollbar.getBoundingClientRect(), y = e.clientY - r.top, th = (C.thumbHeightVh / 100) * window.innerHeight, tc = thumb.offsetTop + th / 2, dy = y - tc;
    scrollParent.scrollTop = Math.max(0, Math.min(scrollParent.scrollTop + dy / C.scale, scrollParent.scrollHeight - scrollParent.clientHeight));
    updateThumbPosition();
  }

  function updateDimensions() {
    const { logDiv, scrollbar, previewContent } = state.elements;
    if (!logDiv || !scrollbar || !previewContent) return;
    const w = logDiv.getBoundingClientRect().width;
    scrollbar.style.width = w * C.scale + "px";
    previewContent.style.width = w + "px";
    updatePreviewContent();
    updateThumbPosition();
    state.observers.height = requestAnimationFrame(updateDimensions);
  }

  function initialize() {
    const s = createScrollbar(), c = createCodeList(), logDiv = document.querySelector('[role="log"]'), scrollParent = logDiv?.parentNode;
    state.elements = { ...s, ...c, logDiv, scrollParent };
    if (!logDiv || !scrollParent) return;

    // Initial update of code list
    updateCodeList();

    // Set up observers
    state.observers.content = new MutationObserver(() => {
      updatePreviewContent();
      updateCodeList();
    });
    state.observers.content.observe(logDiv, { childList: true, subtree: true, characterData: true });

    window.addEventListener("resize", () => {
      updatePreviewContent();
      updateCodeList();
    });

    scrollParent.addEventListener("scroll", updateThumbPosition);
    updateDimensions();
  }

  function cleanup() {
    const { scrollbar, scrollParent, codeList } = state.elements;
    if (scrollbar) scrollbar.remove();
    if (codeList) codeList.remove();
    const main = document.querySelector("main");
    if (main) main.style.paddingLeft = "";
    window.removeEventListener("resize", updatePreviewContent);
    if (scrollParent) scrollParent.removeEventListener("scroll", updateThumbPosition);
    if (state.observers.content) state.observers.content.disconnect();
    if (state.observers.height) cancelAnimationFrame(state.observers.height);

    // Clean up the result display
    const resultDisplay = document.getElementById("t3-code-execution-result");
    if (resultDisplay) resultDisplay.remove();

    state = { lastContentUpdate: 0, elements: {}, observers: {}, codeBlocks: [], codeBlockGroups: [] };
  }

  function waitForLogDiv() {
    const logDiv = document.querySelector('[role="log"]');
    if (logDiv) initialize();
    else setTimeout(waitForLogDiv, 200);
  }

  window.t3ChatUICleanup = () => { cleanup(); delete window.t3ChatUICleanup; };
  waitForLogDiv();
})();

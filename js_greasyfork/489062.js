// ==UserScript==
// @name         ExplainThis Next
// @namespace    next.explainthis.lemoc.uno
// @version      3.2.5
// @description  Press `Ctrl/CMD + ;` to explain selections
// @author       Lemocuber
// @match        http://*/*
// @match        https://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @connect      explain.lemoc.uno
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/489062/ExplainThis%20Next.user.js
// @updateURL https://update.greasyfork.org/scripts/489062/ExplainThis%20Next.meta.js
// ==/UserScript==

const API_URL = "https://explain.lemoc.uno/explain";
const PASSWORD_KEY = "explainthis_lemoc_password";

// Inject Keyframes for Animations
const style = document.createElement('style');
style.textContent = `
  @keyframes brutal-slide-in {
    0% { transform: translateX(100%); filter: brightness(2); }
    70% { transform: translateX(-10px); }
    100% { transform: translateX(0); filter: brightness(1); }
  }
  @keyframes brutal-entry {
    0% { transform: translateY(20px); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
  }
  .et-section-animate {
    animation: brutal-entry 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards;
  }
`;
document.head.appendChild(style);

// --- HELPER FUNCTIONS ---

function requestJson(url, { method, body, headers }) {
  return new Promise((resolve) => {
    GM_xmlhttpRequest({
      url,
      method,
      data: body,
      headers,
      timeout: 15000,
      onload: (response) => {
        resolve({ status: response.status, text: response.responseText });
      },
      onerror: () => resolve({ status: 0, text: "Request error" }),
      ontimeout: () => resolve({ status: 0, text: "Request timeout" }),
    });
  });
}

const explanationCache = {};

function getCachedExplanation(text) {
  const key = text.trim();
  return explanationCache[key] || null;
}

function setCachedExplanation(text, value) {
  const key = text.trim();
  explanationCache[key] = value;
}

async function getPassword() {
  let password = await GM_getValue(PASSWORD_KEY, "");
  if (!password) {
    password = prompt("SYSTEM ACCESS KEY REQUIRED:");
    if (password) await GM_setValue(PASSWORD_KEY, password);
  }
  return password || "";
}

async function clearPassword() {
  await GM_deleteValue(PASSWORD_KEY);
}

// --- UI COMPONENTS ---

const FONT_STACK = 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';

function createLoader(initialText) {
  const loader = document.createElement("div");
  loader.setAttribute("data-explainthis-loader", "true");

  const label = document.createElement("span");
  label.textContent = "STATUS: ";
  label.style.color = "#00ff41";

  const statusText = document.createElement("span");
  statusText.textContent = initialText;

  loader.appendChild(label);
  loader.appendChild(statusText);

  const loaderRules = {
    position: "fixed",
    right: "20px",
    bottom: "20px",
    padding: "12px 20px",
    backgroundColor: "#000",
    color: "#fff",
    border: "4px solid #fff",
    boxShadow: "6px 6px 0px #00ff41",
    fontFamily: FONT_STACK,
    fontSize: "13px",
    fontWeight: "800",
    zIndex: "999999999",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  };
  Object.assign(loader.style, loaderRules);

  return {
    element: loader,
    update: (text) => { statusText.textContent = text; }
  };
}

function createPanel() {
  const panel = document.createElement("div");
  panel.setAttribute("data-explainthis-panel", "true");

  const title = document.createElement("div");
  title.textContent = "EXPLAIN.THIS";

  const hint = document.createElement("div");
  hint.textContent = "ABORT";
  hint.setAttribute("data-explainthis-panel-hint", "true");

  const header = document.createElement("div");
  header.appendChild(title);
  header.appendChild(hint);

  const termWrap = document.createElement("div");
  const termLabel = document.createElement("div");
  termLabel.textContent = "TARGET:";
  const term = document.createElement("div");
  termWrap.appendChild(termLabel);
  termWrap.appendChild(term);

  const status = document.createElement("div");
  const sectionsWrap = document.createElement("div");

  panel.appendChild(header);
  panel.appendChild(termWrap);
  panel.appendChild(status);
  panel.appendChild(sectionsWrap);

  const rules = {
    boxSizing: "border-box",
    position: "fixed",
    right: "20px",
    bottom: "20px",
    width: "540px",
    maxWidth: "40dvw",
    maxHeight: "85vh",
    overflowY: "auto",
    padding: "20px",
    backgroundColor: "#000",
    color: "#fff",
    border: "4px solid #fff",
    boxShadow: "10px 10px 0px #00ff41",
    fontFamily: FONT_STACK,
    fontSize: "15px",
    zIndex: "999999999",
    animation: "brutal-slide-in 0.35s ease-out",
  };


  const headerRules = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    borderBottom: "4px solid #fff",
    paddingBottom: "10px",
  };

  const titleRules = {
    fontWeight: "900",
    fontSize: "20px",
    fontStyle: "italic",
    color: "#00ff41",
  };

  const hintRules = {
    fontSize: "10px",
    fontWeight: "900",
    background: "#fff",
    color: "#000",
    padding: "2px 5px",
    userSelect: "none",
  };

  const termWrapRules = { marginBottom: "15px" };
  const termLabelRules = { fontSize: "11px", color: "#00ff41", marginBottom: "4px", fontWeight: "700" };
  const termRules = {
    backgroundColor: "#fff",
    color: "#000",
    padding: "10px",
    fontWeight: "900",
    fontSize: "18px",
    wordBreak: "break-all",
    border: "2px solid #00ff41"
  };

  const statusRules = {
    fontSize: "12px",
    color: "#00ff41",
    marginBottom: "15px",
    textTransform: "uppercase",
    fontWeight: "700"
  };

  const sectionRules = {
    border: "2px solid #fff",
    marginBottom: "15px",
    backgroundColor: "#111",
    opacity: "0",
  };

  const labelRules = {
    backgroundColor: "#fff",
    color: "#000",
    padding: "4px 8px",
    fontWeight: "900",
    fontSize: "12px",
    display: "inline-block",
    transform: "translate(-2px, -2px)",
    boxShadow: "2px 2px 0px #00ff41"
  };

  const bodyRules = { padding: "12px", lineHeight: "1.5", color: "#eee", fontWeight: "500" };

  Object.assign(panel.style, rules);
  Object.assign(header.style, headerRules);
  Object.assign(title.style, titleRules);
  Object.assign(hint.style, hintRules);
  Object.assign(termWrap.style, termWrapRules);
  Object.assign(termLabel.style, termLabelRules);
  Object.assign(term.style, termRules);
  Object.assign(status.style, statusRules);

  return { panel, term, status, sectionsWrap, sectionRules, labelRules, bodyRules };
}

function updateStatus(statusNode, text) {
  statusNode.textContent = `> ${text}`;
}

function escapeHtml(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function formatBody(body) {
  const escaped = escapeHtml(body);
  const withBold = escaped.replace(/\*\*(.+?)\*\*/g, "<strong style='color:#00ff41; font-weight:800;'>$1</strong>");
  return withBold.replace(/\n{2,}/g, "</p><p>").replace(/\n/g, "<br>");
}

function parseSections(markdown) {
  const lines = markdown.split(/\r?\n/);
  const sections = [];
  let current = null;

  lines.forEach((line) => {
    const titleMatch = line.match(/^###\s+(.*)$/);
    if (titleMatch) {
      if (current && current.title && current.body.trim()) {
        sections.push({ title: current.title, body: current.body.trim() });
      }
      current = { title: titleMatch[1].trim(), body: "" };
      return;
    }
    if (!current) return;
    current.body += `${line}\n`;
  });

  if (current && current.title && current.body.trim()) {
    sections.push({ title: current.title, body: current.body.trim() });
  }

  if (!sections.length && markdown.trim()) {
    sections.push({ title: "DEFINITION", body: markdown.trim() });
  }

  return sections;
}

function renderSections(panelState, sections) {
  panelState.sectionsWrap.innerHTML = "";
  sections.forEach((section, index) => {
    const wrap = document.createElement("div");
    const label = document.createElement("div");
    const body = document.createElement("div");

    label.textContent = `[${section.title.toUpperCase()}]`;
    body.innerHTML = `<p>${formatBody(section.body)}</p>`;

    Object.assign(wrap.style, panelState.sectionRules);
    Object.assign(label.style, panelState.labelRules);
    Object.assign(body.style, panelState.bodyRules);

    wrap.classList.add('et-section-animate');
    wrap.style.animationDelay = `${index * 0.1}s`;

    wrap.appendChild(label);
    wrap.appendChild(body);
    panelState.sectionsWrap.appendChild(wrap);
  });
}

// --- MAIN LOGIC ---

(function () {
  "use strict";

  let activePanel = null;
  let activeLoader = null;

  function closeActiveUI() {
    if (activeLoader) {
      activeLoader.element.remove();
      activeLoader = null;
    }
    if (activePanel) {
      activePanel.panel.style.transform = "translateX(120%)";
      activePanel.panel.style.transition = "transform 0.25s ease-in";
      const p = activePanel.panel;
      setTimeout(() => p.remove(), 300);
      activePanel = null;
    }
  }

  document.addEventListener("keydown", async (event) => {
    // Toggle on Ctrl/Cmd + ;
    if (!((event.ctrlKey || event.metaKey) && event.key === ";")) return;
    event.preventDefault();

    // Close if already open
    if (activePanel || activeLoader) {
      closeActiveUI();
      return;
    }

    const selection = window.getSelection().toString().trim();
    if (!selection || selection.length > 500) return;

    const cached = getCachedExplanation(selection);
    if (cached) {
      const sections = parseSections(cached);
      if (!sections.length) {
        return;
      }
      activePanel = createPanel();
      activePanel.term.textContent = selection;
      updateStatus(activePanel.status, "EXPLAINED.");
      renderSections(activePanel, sections);
      activePanel.panel
        .querySelector('[data-explainthis-panel-hint="true"]')
        .addEventListener("click", closeActiveUI);
      document.body.appendChild(activePanel.panel);
      return;
    }

    // 1. Show Small Loader first
    activeLoader = createLoader("INITIALIZING...");
    document.body.appendChild(activeLoader.element);

    const password = await getPassword();
    if (!password) {
      activeLoader.update("ACCESS DENIED: NO KEY.");
      setTimeout(() => { if(activeLoader) activeLoader.element.remove(); activeLoader = null; }, 2000);
      return;
    }

    activeLoader.update("ANALYZING...");

    try {
      const response = await requestJson(API_URL, {
        method: "POST",
        body: JSON.stringify({ text: selection }),
        headers: {
          "Content-Type": "application/json",
          "X-Explain-Password": password,
        },
      });

      if (response.status === 401) {
        await clearPassword();
        activeLoader.update("AUTH_FAILURE: KEY REVOKED.");
        return;
      }

      if (response.status !== 200) {
        activeLoader.update(`SYSTEM_ERROR: ${response.status}`);
        return;
      }

      setCachedExplanation(selection, response.text);

      const sections = parseSections(response.text);
      if (!sections.length) {
        activeLoader.update("NULL_RESPONSE: NO DATA.");
        return;
      }

      // 2. Data is ready, remove loader and open full panel
      if (activeLoader) {
          activeLoader.element.remove();
          activeLoader = null;
      }

      activePanel = createPanel();
      activePanel.term.textContent = selection;
      updateStatus(activePanel.status, "EXPLAINED.");
      renderSections(activePanel, sections);
      activePanel.panel
        .querySelector('[data-explainthis-panel-hint="true"]')
        .addEventListener("click", closeActiveUI);
      document.body.appendChild(activePanel.panel);

    } catch (error) {
      if (activeLoader) activeLoader.update("CRITICAL_NETWORK_FAILURE.");
      else if (activePanel) updateStatus(activePanel.status, "CRITICAL_NETWORK_FAILURE.");
    }
  });
})();
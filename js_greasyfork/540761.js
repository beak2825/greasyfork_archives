// ==UserScript==
// @name         Google Docs: Bypass Copy Disabled (UI Dropdown)
// @namespace    Violentmonkey Scripts
// @version      2.16
// @description  Adds a drop-up menu to extract text from restricted Google Docs. Options: copy, console output, paste into popup, or download as .txt. 
//               📌 Especially useful for view-only Google Docs where copying, downloading, and sharing are disabled.
// @author       Temnicc
// @license      MIT
// @match        https://docs.google.com/document/d/*
// @downloadURL https://update.greasyfork.org/scripts/540761/Google%20Docs%3A%20Bypass%20Copy%20Disabled%20%28UI%20Dropdown%29.user.js
// @updateURL https://update.greasyfork.org/scripts/540761/Google%20Docs%3A%20Bypass%20Copy%20Disabled%20%28UI%20Dropdown%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function extractText() {
    const chunks = [...document.querySelectorAll("script")]
      .filter(el => el.innerHTML.includes("DOCS_modelChunk = "))
      .map(el => el.innerHTML);

    let textChunks = "";

    for (const chunk of chunks) {
      const matches = chunk.match(/"s":"(.*?)"/g);
      if (matches) {
        for (const match of matches) {
          const extracted = match
            .replace(/^"s":"|"$|\\n/g, '')
            .replace(/\\"/g, '"')
            .replace(/\\\\/g, '\\')
            .replace(/\\u000b/g, '\n\n');
          textChunks += extracted + '\n\n';
        }
      }
    }

    return textChunks;
  }

  function downloadTxt(text) {
    const blob = new Blob([text], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'extracted_doc.txt';
    a.click();
  }

  function pasteToBody(text) {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '10px';
  container.style.left = '10px';
  container.style.zIndex = 99999;
  container.style.maxHeight = '90vh';
  container.style.overflowY = 'auto';
  container.style.padding = '20px';
  container.style.border = '1px solid #ccc';
  container.style.backgroundColor = '#f9f9f9';
  container.style.fontFamily = 'monospace';
  container.style.whiteSpace = 'pre-wrap';
  container.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
  container.style.borderRadius = '8px';
  container.style.width = '600px';

  const closeBtn = document.createElement('button');
  closeBtn.innerText = '❌ Close';
  closeBtn.style.position = 'absolute';
  closeBtn.style.top = '8px';
  closeBtn.style.right = '8px';
  closeBtn.style.background = '#e74c3c';
  closeBtn.style.color = 'white';
  closeBtn.style.border = 'none';
  closeBtn.style.padding = '4px 8px';
  closeBtn.style.cursor = 'pointer';
  closeBtn.style.borderRadius = '4px';

  closeBtn.onclick = () => container.remove();

  const textBlock = document.createElement('pre');
  textBlock.textContent = text;

  container.appendChild(closeBtn);
  container.appendChild(textBlock);
  document.body.appendChild(container);
}


  // menu
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.bottom = "20px";
  container.style.right = "20px";
  container.style.zIndex = 99999;
  container.style.fontFamily = "Arial, sans-serif";

  const toggleBtn = document.createElement("button");
  toggleBtn.textContent = "^";
  Object.assign(toggleBtn.style, {
    backgroundColor: "#4285F4",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
    width: "40px"
  });

  const menu = document.createElement("div");
  menu.style.display = "none";
  menu.style.flexDirection = "column";
  menu.style.marginBottom = "8px";
  menu.style.background = "white";
  menu.style.border = "1px solid #ccc";
  menu.style.borderRadius = "6px";
  menu.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
  menu.style.overflow = "hidden";

  const makeMenuItem = (label, action) => {
    const item = document.createElement("button");
    item.textContent = label;
    Object.assign(item.style, {
      padding: "8px 12px",
      background: "white",
      border: "none",
      borderBottom: "1px solid #eee",
      textAlign: "left",
      cursor: "pointer",
      fontSize: "14px"
    });
    item.onmouseover = () => item.style.background = "#f0f0f0";
    item.onmouseout = () => item.style.background = "white";
    item.onclick = () => {
      menu.style.display = "none";
      toggleBtn.textContent = "^";
      action();
    };
    return item;
  };

  const actions = [
    makeMenuItem("📋 Copy document TXT", () => {
      const text = extractText();
      navigator.clipboard.writeText(text).then(() => {
        console.log("✅ Copied to clipboard");
      });
    }),
    makeMenuItem("💻 Output to console", () => {
      console.log("✅ Extracted text:\n\n" + extractText());
    }),
    makeMenuItem("📄 Output and Paste", () => {
      pasteToBody(extractText());
    }),
    makeMenuItem("💾 Download as TXT", () => {
      downloadTxt(extractText());
    })
  ];

  actions.forEach(btn => menu.appendChild(btn));
  container.appendChild(menu);
  container.appendChild(toggleBtn);
  document.body.appendChild(container);

  toggleBtn.onclick = () => {
    const isOpen = menu.style.display === "flex";
    menu.style.display = isOpen ? "none" : "flex";
    toggleBtn.textContent = isOpen ? "^" : "v";
  };
})();

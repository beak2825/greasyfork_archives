// ==UserScript==
// @name         Code Diff Checker
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Compare differences between two code versions
// @author       maanimis
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @require      https://cdnjs.cloudflare.com/ajax/libs/jsdiff/7.0.0/diff.min.js
// @run-at      document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529585/Code%20Diff%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/529585/Code%20Diff%20Checker.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function createUI() {
    if (document.getElementById("diffOverlay")) return;

    const overlay = document.createElement("div");
    Object.assign(overlay.style, {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: "10000",
    });
    overlay.id = "diffOverlay";
    overlay.addEventListener(
      "click",
      (e) => e.target === overlay && overlay.remove()
    );

    const modal = document.createElement("div");
    Object.assign(modal.style, {
      background: "white",
      borderRadius: "10px",
      padding: "20px",
      width: "90%",
      maxWidth: "500px",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    });

    modal.innerHTML = `
            <h2 style="margin:0; text-align:center;">Code Diff Checker</h2>
            <textarea id="oldText" rows="5" placeholder="Old Version" style="width:100%;"></textarea>
            <textarea id="newText" rows="5" placeholder="New Version" style="width:100%;"></textarea>
            <button id="compareBtn" style="background:#28a745; color:white; border:none; padding:10px; cursor:pointer; font-size:14px;">Compare</button>
            <pre id="diffOutput" style="background:#f6f8fa; border:1px solid #e1e4e8; padding:10px; white-space:pre-wrap; font-family:Courier New, monospace; max-height:200px; overflow-y:auto;"></pre>
        `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    document
      .getElementById("compareBtn")
      .addEventListener("click", compareDiff);
  }

  function escapeHtml(text) {
    return text.replace(
      /[&<>"']/g,
      (m) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#039;",
        }[m])
    );
  }

  function createDiff(oldText, newText) {
    return Diff.diffLines(oldText, newText)
      .map((change) => {
        const style = change.added
          ? "background:#e6ffed;color:#22863a;padding:5px;"
          : change.removed
          ? "background:#ffeef0;color:#d73a49;padding:5px;"
          : "padding:5px;";
        return `<div style="${style}">${
          (change.added ? "+ " : change.removed ? "- " : "  ") +
          escapeHtml(change.value).replace(/\n/g, "<br>")
        }</div>`;
      })
      .join("");
  }

  function compareDiff() {
    document.getElementById("diffOutput").innerHTML = createDiff(
      document.getElementById("oldText").value,
      document.getElementById("newText").value
    );
  }

  GM_registerMenuCommand("Open Code Diff Checker", createUI);
})();

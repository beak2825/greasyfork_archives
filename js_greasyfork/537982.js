// ==UserScript==
// @name         Grok Source File Uploader
// @namespace    https://greasyfork.org/users/your-username
// @version      1.2
// @description  Adds a button to upload any source files to Grok by renaming them to .txt so they are accepted.
// @author       Moore
// @match        *://x.com/i/grok*
// @match        *://*.x.com/i/grok*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537982/Grok%20Source%20File%20Uploader.user.js
// @updateURL https://update.greasyfork.org/scripts/537982/Grok%20Source%20File%20Uploader.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function log(msg) {
    console.log(`[GrokUploader] ${msg}`);
  }

  function addCustomStyles() {
    const style = document.createElement("style");
    style.textContent = `
      /* Try to match full hover behavior of native Grok media button */
      .custom-upload-btn:hover {
        background-color: rgba(182, 185, 188, 0.1) !important;
        border-radius: 9999px !important;
      }

      .custom-upload-btn:focus-visible {
        outline: 2px solid rgba(29, 155, 240, 0.5) !important;
      }

      .custom-upload-btn {
        transition: background-color 0.2s ease-in-out;
      }
    `;
    document.head.appendChild(style);
    //log("🎨 Custom hover styles injected.");
  }

  function injectUploadButton() {
    const mediaBtn = document.querySelector('button[aria-label="Media"]');
    if (!mediaBtn) {
      //log("❌ Media button not found.");
      return false;
    }

    if (document.getElementById('custom-grok-upload-wrapper')) {
      //log("✅ Upload button already injected.");
      return true;
    }

    //log("✅ Found Media button. Proceeding to clone.");

    const wrapperDiv = document.createElement("div");
    wrapperDiv.className = mediaBtn.parentElement.className;
    wrapperDiv.id = "custom-grok-upload-wrapper";

    const customBtn = mediaBtn.cloneNode(true);
    customBtn.id = "custom-grok-upload";
    customBtn.classList.add("custom-upload-btn");
    customBtn.setAttribute("aria-label", "Upload source files");

    // Inherit all original classes while keeping ours
    customBtn.classList.add(...mediaBtn.classList);
    customBtn.style.cssText = mediaBtn.style.cssText;

    const originalSvg = mediaBtn.querySelector("svg");
    const svgClass = originalSvg?.getAttribute("class") || "";
    const svgStyle = originalSvg?.getAttribute("style") || getComputedStyle(originalSvg)?.color || "";

    customBtn.querySelector("svg").outerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true" class="${svgClass}" style="color: ${svgStyle};">
        <g>
          <path d="M5 20h14v-2H5v2zm7-18L5.33 9h3.17v4h4.99v-4h3.17L12 2z"></path>
        </g>
      </svg>
    `;

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "*/*";
    fileInput.multiple = true;
    fileInput.style.display = "none";

    customBtn.addEventListener("click", () => {
      //log("📂 File input clicked.");
      fileInput.click();
    });

    fileInput.addEventListener("change", async (e) => {
      //log(`📁 Selected ${e.target.files.length} file(s).`);
      const files = Array.from(e.target.files);
      if (files.length === 0) return;

      const nativeInput = document.querySelector('input[type="file"]');
      if (!nativeInput) {
        //log("❌ Native Grok file input not found.");
        alert("Grok file input not found. Try clicking the 📎 icon manually once first.");
        return;
      }

      const dt = new DataTransfer();

      for (const file of files) {
        const content = await file.text();
        const renamedFile = new File(
          [new Blob([content], { type: "text/plain" })],
          file.name.replace(/\.[^/.]+$/, "") + ".txt",
          { type: "text/plain" }
        );
        dt.items.add(renamedFile);
        //log(`📦 Converted ${file.name} → ${renamedFile.name}`);
      }

      nativeInput.files = dt.files;
      nativeInput.dispatchEvent(new Event("change", { bubbles: true }));
      //log("✅ Injected files into native Grok file input.");
      fileInput.value = "";
    });

    wrapperDiv.appendChild(customBtn);
    document.body.appendChild(fileInput);
    mediaBtn.parentElement.parentElement.insertBefore(wrapperDiv, mediaBtn.parentElement);

    //log("🚀 Upload button injected next to original.");
    return true;
  }

  function waitForMediaButton(timeout = 10000, interval = 500) {
    const start = Date.now();
    const intervalId = setInterval(() => {
      const success = injectUploadButton();
      if (success) {
        //log("🎯 Injection succeeded.");
        clearInterval(intervalId);
      } else if (Date.now() - start > timeout) {
        //log("⏱️ Timeout reached. Giving up injection.");
        clearInterval(intervalId);
      }
    }, interval);
  }

  addCustomStyles();
  waitForMediaButton();

  const observer = new MutationObserver(() => {
    //log("👀 DOM mutated. Retrying injection.");
    injectUploadButton();
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();

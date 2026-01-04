// ==UserScript==
// @name         Ultimate Night Mode
// @namespace    (link unavailable)
// @version      0.13
// @description  Change websites to pure black background with customization options
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/505881/Ultimate%20Night%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/505881/Ultimate%20Night%20Mode.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Load settings
  const cfg = {
    bgColor: GM_getValue("bgColor", "#000000"),
    textColor: GM_getValue("textColor", "#D3D3D3"), // Light Gray
    linkColor: GM_getValue("linkColor", "#1E90FF"), // Bright Blue
    visitedLinkColor: GM_getValue("visitedLinkColor", "#551A8B"), // Purple
    imgBrightness: GM_getValue("imgBrightness", 0.8),
    imgContrast: GM_getValue("imgContrast", 1.2),
    bgTransparency: GM_getValue("bgTransparency", 1),
    disableAllExceptBg: GM_getValue("disableAllExceptBg", false) // New option to disable all except background color
  };

  // CSS styles
  const css = `
    html, body {
      background-color: ${hexToRgba(cfg.bgColor, cfg.bgTransparency)} !important;
      ${cfg.disableAllExceptBg ? '' : `color: ${cfg.textColor} !important;`}
    }
    ${cfg.disableAllExceptBg ? '' : `
      * {
        background-color: rgba(0, 0, 0, 0.5) !important;
        border-color: #444444 !important;
      }
      a {
        color: ${cfg.linkColor} !important;
      }
      a:visited {
        color: ${cfg.visitedLinkColor} !important;
      }
      img.content-image {
        filter: brightness(${cfg.imgBrightness}) contrast(${cfg.imgContrast});
      }
      video, .html5-video-container video {
        filter: none !important;
      }
    `}
  `;

  // Apply styles
  const style = document.createElement('style');
  style.type = 'text/css';
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);

  // Mutation observer to handle dynamic content
  const observer = new MutationObserver(function () {
    document.documentElement.style.backgroundColor = hexToRgba(cfg.bgColor, cfg.bgTransparency);
    document.body.style.backgroundColor = hexToRgba(cfg.bgColor, cfg.bgTransparency);
  });

  // Limit the observer to the body to avoid performance issues
  observer.observe(document.body, { childList: true, subtree: true });

  // Create configuration window
  function openConfigWindow() {
    const div = document.createElement('div');
    div.style.position = 'fixed';
    div.style.top = '10%';
    div.style.left = '50%';
    div.style.transform = 'translateX(-50%)';
    div.style.backgroundColor = '#333';
    div.style.color = '#fff';
    div.style.padding = '20px';
    div.style.border = '1px solid #444';
    div.style.zIndex = '10000';
    div.innerHTML = `
      <h2>Customize Theme</h2>
      <label>BG Color: <input type="color" id="bgColor" value="${cfg.bgColor}"></label><br>
      <label>Text: <input type="color" id="textColor" value="${cfg.textColor}"></label><br>
      <label>Link: <input type="color" id="linkColor" value="${cfg.linkColor}"></label><br>
      <label>Visited: <input type="color" id="visitedLinkColor" value="${cfg.visitedLinkColor}"></label><br>
      <label>Brightness: <input type="range" id="imgBrightness" min="0" max="1" step="0.1" value="${cfg.imgBrightness}"></label><br>
      <label>Contrast: <input type="range" id="imgContrast" min="1" max="2" step="0.1" value="${cfg.imgContrast}"></label><br>
      <label>Transparency: <input type="range" id="bgTransparency" min="0" max="1" step="0.1" value="${cfg.bgTransparency}"></label><br>
      <label>Disable All Except BG Color: <input type="checkbox" id="disableAllExceptBg" ${cfg.disableAllExceptBg ? 'checked' : ''}></label><br>
      <button id="saveConfig">Save</button>
      <button id="closeConfig">Close</button>
    `;
    document.body.appendChild(div);

    // Save configuration
    document.getElementById('saveConfig').addEventListener('click', () => {
      GM_setValue("bgColor", document.getElementById('bgColor').value);
      GM_setValue("textColor", document.getElementById('textColor').value);
      GM_setValue("linkColor", document.getElementById('linkColor').value);
      GM_setValue("visitedLinkColor", document.getElementById('visitedLinkColor').value);
      GM_setValue("imgBrightness", parseFloat(document.getElementById('imgBrightness').value));
      GM_setValue("imgContrast", parseFloat(document.getElementById('imgContrast').value));
      GM_setValue("bgTransparency", parseFloat(document.getElementById('bgTransparency').value));
      GM_setValue("disableAllExceptBg", document.getElementById('disableAllExceptBg').checked);
      location.reload();
    });

    document.getElementById('closeConfig').addEventListener('click', () => {
      div.remove();
    });
  }

  // Convert hex to rgba
  function hexToRgba(hex, alpha) {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
      r = parseInt(hex.slice(1, 3), 16);
      g = parseInt(hex.slice(3, 5), 16);
      b = parseInt(hex.slice(5, 7), 16);
    }
    return `rgba(${r},${g},${b},${alpha})`;
  }

  // Menu command to open configuration window
  if (typeof GM_registerMenuCommand !== "undefined") {
    GM_registerMenuCommand("Customize Theme", openConfigWindow, "C");
  }
})();

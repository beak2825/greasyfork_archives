// ==UserScript==
// @name         MonkeyCamBlur
// @namespace    https://vyoe.com
// @version      1.0
// @description  Auto blur new video streams with toggle hotkey and customizable settings UI with rainbow watermark
// @author       YourName
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539823/MonkeyCamBlur.user.js
// @updateURL https://update.greasyfork.org/scripts/539823/MonkeyCamBlur.meta.js
// ==/UserScript==

(function() {
  'use strict';

  console.log("MonkeyCamBlur Extension Loaded ✅");

  let isBlurred = true;
  let blurStrength = 20;  // default blur px
  let toggleKey = "b";    // default hotkey to toggle blur

  // Blur all new videos once
  function blurNewVideos() {
    const videos = document.querySelectorAll("video.agora_video_player");
    videos.forEach(video => {
      if (!video.dataset.monkeyBlurred) {
        video.style.filter = `blur(${blurStrength}px)`;
        video.style.transition = "filter 0.1s ease";
        video.dataset.monkeyBlurred = "true";
      }
    });
    isBlurred = true;
  }

  function blurVideos() {
    const videos = document.querySelectorAll("video.agora_video_player");
    videos.forEach(video => {
      video.style.filter = `blur(${blurStrength}px)`;
      video.style.transition = "filter 0.1s ease";
    });
    isBlurred = true;
  }

  function unblurVideos() {
    const videos = document.querySelectorAll("video.agora_video_player");
    videos.forEach(video => {
      video.style.filter = "none";
    });
    isBlurred = false;
  }

  function toggleBlur() {
    if (isBlurred) {
      unblurVideos();
    } else {
      blurVideos();
    }
  }

  function createSettingsPanel() {
    if (document.getElementById("monkeyCamSettings")) return;

    const panel = document.createElement("div");
    panel.id = "monkeyCamSettings";
    Object.assign(panel.style, {
      position: "fixed",
      bottom: "80px",
      left: "20px",
      width: "280px",
      backgroundColor: "rgba(25, 25, 30, 0.95)",
      color: "#eee",
      padding: "20px",
      borderRadius: "12px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      fontSize: "15px",
      fontWeight: "500",
      boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
      userSelect: "none",
      zIndex: 10000,
      backdropFilter: "blur(8px)",
      display: "none",
    });

    panel.innerHTML = `
      <div style="font-size: 20px; font-weight: 700; margin-bottom: 15px; text-align:center; color: #7c4dff;">
        MonkeyCamBlur Settings
      </div>

      <label for="blurSlider" style="display:block; margin-bottom:8px; font-weight:600;">
        Blur Strength: <span id="blurValue">${blurStrength}</span> px
      </label>
      <input type="range" id="blurSlider" min="1" max="100" value="${blurStrength}" style="width: 100%; margin-bottom: 20px; cursor:pointer; accent-color: #7c4dff;">

      <label for="hotkeyInput" style="display:block; margin-bottom:8px; font-weight:600;">
        Toggle Hotkey:
      </label>
      <input type="text" id="hotkeyInput" readonly placeholder="Click here and press a key" 
        style="
          width: 100%; 
          padding: 8px 10px; 
          font-size: 16px; 
          border-radius: 8px; 
          border: 1.5px solid #555; 
          background-color: #121217; 
          color: #ddd;
          text-align: center;
          letter-spacing: 1.2px;
          cursor: pointer;
          user-select: none;
        "
        title="Click and press any key to set hotkey"
      >
      <div id="hotkeyInfo" style="margin-top:6px; font-size: 13px; color: #bbb; text-align:center; min-height:18px;">
        Current hotkey: <span style="color:#7c4dff; font-weight:600; text-transform: uppercase;">${toggleKey}</span>
      </div>
    `;

    document.body.appendChild(panel);

    const blurSlider = document.getElementById("blurSlider");
    const blurValue = document.getElementById("blurValue");
    blurSlider.addEventListener("input", () => {
      blurStrength = parseInt(blurSlider.value);
      blurValue.textContent = blurStrength;
      if (isBlurred) blurVideos();
    });

    const hotkeyInput = document.getElementById("hotkeyInput");
    const hotkeyInfo = document.getElementById("hotkeyInfo");

    hotkeyInput.addEventListener("focus", () => {
      hotkeyInput.value = "";
    });

    hotkeyInput.addEventListener("keydown", (e) => {
      e.preventDefault();
      let key = e.key;

      if (key === " ") key = "Space";
      else if (key === "Escape") key = "Esc";

      key = key.toLowerCase();

      if (
        (key.length === 1 && /^[a-z0-9]$/.test(key)) ||
        /^f\d{1,2}$/.test(key) ||
        ["escape", "space", "enter", "tab", "shift", "control", "alt", "meta", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key)
      ) {
        toggleKey = key;
        hotkeyInput.value = key.toUpperCase();
        hotkeyInfo.innerHTML = `Current hotkey: <span style="color:#7c4dff; font-weight:600; text-transform: uppercase;">${toggleKey}</span>`;
        hotkeyInput.blur();
        console.log(`MonkeyCamBlur hotkey set to "${toggleKey}"`);
      }
    });
  }

  function addWatermark() {
    if (document.getElementById("monkeyCamWatermark")) return;

    const watermark = document.createElement("div");
    watermark.id = "monkeyCamWatermark";
    watermark.textContent = "vyoe owns dharris";
    Object.assign(watermark.style, {
      position: "fixed",
      bottom: "15px",
      right: "20px",
      fontSize: "48px",
      fontWeight: "900",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      background: "linear-gradient(270deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #8f00ff)",
      backgroundSize: "1400% 1400%",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      animation: "rainbowGradient 10s ease infinite",
      userSelect: "none",
      pointerEvents: "none",
      zIndex: 10000,
      textShadow: "0 0 8px rgba(0,0,0,0.8)",
    });

    // Rainbow gradient animation keyframes
    const style = document.createElement("style");
    style.textContent = `
      @keyframes rainbowGradient {
        0%{background-position:0% 50%}
        50%{background-position:100% 50%}
        100%{background-position:0% 50%}
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(watermark);
  }

  function createSettingsToggleWheel() {
    if (document.getElementById("monkeyCamSettingsToggle")) return;

    const wheel = document.createElement("div");
    wheel.id = "monkeyCamSettingsToggle";
    Object.assign(wheel.style, {
      position: "fixed",
      bottom: "20px",
      left: "20px",
      width: "50px",
      height: "50px",
      borderRadius: "50%",
      background: "linear-gradient(270deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #8f00ff)",
      backgroundSize: "1400% 1400%",
      cursor: "pointer",
      zIndex: 10001,
      boxShadow: "0 0 10px rgba(0,0,0,0.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      animation: "rainbowGradient 10s ease infinite",
    });

    wheel.title = "Toggle MonkeyCamBlur Settings";

    // Gear icon SVG inside wheel
    wheel.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" viewBox="0 0 24 24" width="28" height="28" style="filter: drop-shadow(0 0 2px rgba(0,0,0,0.7));">
        <path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7zm7.43-2.27c.05-.32.07-.66.07-1s-.02-.68-.07-1l2.11-1.65a.5.5 0 0 0 .11-.64l-2-3.46a.5.5 0 0 0-.6-.22l-2.49 1a7.06 7.06 0 0 0-1.73-1l-.38-2.65A.5.5 0 0 0 13 3h-4a.5.5 0 0 0-.49.42l-.38 2.65a7.06 7.06 0 0 0-1.73 1l-2.49-1a.5.5 0 0 0-.6.22l-2 3.46a.5.5 0 0 0 .11.64L4.57 11.2c-.05.32-.07.66-.07 1s.02.68.07 1l-2.11 1.65a.5.5 0 0 0-.11.64l2 3.46a.5.5 0 0 0 .6.22l2.49-1a7.06 7.06 0 0 0 1.73 1l.38 2.65a.5.5 0 0 0 .49.42h4a.5.5 0 0 0 .49-.42l.38-2.65a7.06 7.06 0 0 0 1.73-1l2.49 1a.5.5 0 0 0 .6-.22l2-3.46a.5.5 0 0 0-.11-.64z"/>
      </svg>
    `;

    wheel.onclick = () => {
      const panel = document.getElementById("monkeyCamSettings");
      if (!panel) return;
      panel.style.display = (panel.style.display === "none" || panel.style.display === "") ? "block" : "none";
    };

    document.body.appendChild(wheel);
  }

  const observer = new MutationObserver(() => {
    blurNewVideos();
  });
  observer.observe(document.body, { childList: true, subtree: true });

  document.addEventListener("keydown", (e) => {
    if (e.repeat) return;
    if (e.key.toLowerCase() === toggleKey) {
      toggleBlur();
    }
  });

  window.addEventListener("load", () => {
    blurNewVideos();
    createSettingsPanel();
    addWatermark();
    createSettingsToggleWheel();
    console.log("MonkeyCamBlur initialized with blur strength", blurStrength, "and toggle key", toggleKey);
  });
})();

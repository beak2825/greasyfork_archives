// ==UserScript==
// @name         CollabVM CRT Mode Button
// @name:es      Botón de modo CRT de CollabVM
// @match        https://computernewb.com/collab-vm/*
// @grant        none
// @description  Adds a toggleable CRT-style effect to the CollabVM display.
// @description:es  Agrega un efecto estilo CRT alternable a la pantalla CollabVM.
// @license MIT
// @version 0.0.1.30250617163501
// @namespace https://greasyfork.org/users/1484733
// @downloadURL https://update.greasyfork.org/scripts/539776/CollabVM%20CRT%20Mode%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/539776/CollabVM%20CRT%20Mode%20Button.meta.js
// ==/UserScript==

(function () {
  // console.log("[CRT Script] Script loaded!");

function getVmDisplay() {
  // Returns the #vmDisplay element if it exists, otherwise logs an error and returns null.
  const el = document.getElementById("vmDisplay");
  if (!el) {
    console.log("[CRT Script] #vmDisplay not found.");
    return null;
  }
  return el;
}

function ensureCRTEffects(vmDisplay) {
  // Injects CRT effect styles if not already present,
  // and ensures CRT overlay divs exist inside #vmDisplay.
  try {
    if (!document.getElementById("crt-effects-style")) {
      const style = document.createElement("style");
      style.id = "crt-effects-style";
      style.textContent = `
#vmDisplay {
  display: table;
  margin: 24px auto;
  position: relative;
}
#vmDisplay.crt-canvas {
  background: #191919 radial-gradient(ellipse at 60% 40%, #222 75%, #111 100%);
  overflow: hidden;
  will-change: transform;
  line-height: 0;
}
#vmDisplay.crt-canvas canvas {
  display: block;
  margin: 0;
  padding: 0;
  border-radius: 8px;
  /* Slight retro warp */
  filter: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><filter id="w"><feTurbulence type="turbulence" baseFrequency="0.009 0.012" numOctaves="2" result="t"/><feDisplacementMap in2="t" in="SourceGraphic" scale="2" xChannelSelector="R" yChannelSelector="G"/></filter></svg>#w');
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
}
#vmDisplay.crt-canvas::before {
  content: '';
  pointer-events: none;
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: repeating-linear-gradient(rgba(0,0,0,0.16) 0px, rgba(0,0,0,0.16) 1.4px, transparent 1.4px, transparent 3px);
  mix-blend-mode: multiply;
  z-index: 10;
}
#vmDisplay.crt-canvas::after {
  content: '';
  pointer-events: none;
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: radial-gradient(ellipse at center, transparent 85%, rgba(0,0,0,0.10) 100%);
  z-index: 11;
}
.crt-bulge {
  pointer-events: none;
  position: absolute;
  inset: 0;
  z-index: 2;
  border-radius: 32px;
  background: radial-gradient(ellipse at 60% 45%, rgba(255,255,255,0.17) 0%, rgba(0,0,0,0.39) 100%);
  opacity: 0.24;
  mix-blend-mode: lighten;
}
.crt-scanlines {
  pointer-events: none;
  position: absolute;
  inset: 0;
  z-index: 3;
  background: repeating-linear-gradient(
    to bottom,
    transparent 0px,
    transparent 1.15px,
    rgba(0,0,0,0.20) 1.15px,
    rgba(0,0,0,0.06) 1.8px,
    transparent 2.2px,
    transparent 3.3px
  );
  opacity: 0.19;
  mix-blend-mode: multiply;
}
.crt-dotmask {
  pointer-events: none;
  position: absolute;
  inset: 0;
  z-index: 4;
  background: repeating-linear-gradient(
    to right,
    rgba(255,0,0,0.12) 0px, rgba(255,0,0,0.12) 1px, transparent 1.5px, transparent 3px
  ),
  repeating-linear-gradient(
    to bottom,
    transparent 0px, transparent 2px, rgba(0,255,0,0.12) 2px, transparent 3px
  );
  opacity: 0.15;
  mix-blend-mode: screen;
}
.crt-phosphor {
  pointer-events: none;
  position: absolute;
  inset: 0;
  z-index: 5;
  box-shadow: 0 0 24px 8px #aaffaa, 0 0 64px 14px #00bfff;
  opacity: 0.20;
  filter: blur(1.5px) brightness(1.1);
}
      `;
      document.head.appendChild(style);
    }
    // Ensure CRT overlays exist
    ["crt-bulge", "crt-scanlines", "crt-dotmask", "crt-phosphor"].forEach(cls => {
      if (!vmDisplay.querySelector("." + cls)) {
        const div = document.createElement("div");
        div.className = cls;
        vmDisplay.appendChild(div);
      }
    });
  } catch (e) {
    console.error("[CRT Script] Error in ensureCRTEffects:", e);
  }
}

  let crtFrameCount = 0;
  let crtFlickerValue = 1;
  let crtFlickerFrame;
  let retroEffect = false;

function crtFlicker() {
  // Animates CRT flicker and simulates an antialiased filter.
  try {
    crtFrameCount++;
    if (crtFrameCount % 2 === 0) {
      const target = 0.98 + Math.random() * 0.06;
      crtFlickerValue += (target - crtFlickerValue) * 0.25;
      const vmDisplay = getVmDisplay();
      if (vmDisplay && vmDisplay.classList.contains("crt-canvas")) {
        const canvas = vmDisplay.querySelector("canvas");
        if (canvas) {
          // "FXAA" style softening:
          canvas.style.filter =
            `contrast(1.05) brightness(${crtFlickerValue}) saturate(1.05) blur(0.4px) drop-shadow(0 0 1px #fff5)`;
        }
      }
    }
    crtFlickerFrame = requestAnimationFrame(crtFlicker);
  } catch (e) {
    console.error("[CRT Script] Error in crtFlicker:", e);
  }
}

function startCrtFlicker() {
  // Enables CRT flicker and ensures CRT overlays/styles are present.
  try {
    const vmDisplay = getVmDisplay();
    if (vmDisplay) {
      ensureCRTEffects(vmDisplay);
    }
    crtFrameCount = 0;
    crtFlickerValue = 1;
    crtFlicker();
    console.log("[CRT Script] CRT flicker started.");
  } catch (e) {
    console.error("[CRT Script] Error in startCrtFlicker:", e);
  }
}


function stopCrtFlicker() {
  // Disables the CRT flicker animation and resets frame reference.
  try {
    if (typeof crtFlickerFrame !== "undefined") {
      cancelAnimationFrame(crtFlickerFrame);
      crtFlickerFrame = undefined;
      console.log("[CRT Script] CRT flicker stopped.");
    }
  } catch (e) {
    console.error("[CRT Script] Error in stopCrtFlicker:", e);
  }
}

function addCrtBtn() {
  // Adds the CRT toggle button to the UI and manages its behavior.
  try {
    const btns = document.getElementById("btns");
    if (!btns) {
      // Throttle log spam
      if (!addCrtBtn.lastLog || Date.now() - addCrtBtn.lastLog > 2000) {
        console.log("[CRT Script] #btns not found, will try again.");
        addCrtBtn.lastLog = Date.now();
      }
      return;
    }

    let wrapper = document.getElementById("crtBtnWrapper");
    if (!wrapper) {
      wrapper = document.createElement("div");
      wrapper.id = "crtBtnWrapper";
      wrapper.style.display = "inline-block";

      // Create the CRT button
      const btn = document.createElement("button");
      btn.id = "crtBtn";
      btn.className = "btn btn-secondary";
      btn.style.display = "inline";
      btn.style.margin = "0";
      btn.textContent = retroEffect ? "🖥️ Normal Mode" : "📺 CRT Mode";
      btn.onclick = function () {
        retroEffect = !retroEffect;
        btn.textContent = retroEffect ? "🖥️ Normal Mode" : "📺 CRT Mode";
        const vmDisplay = getVmDisplay();
        if (!vmDisplay) return;
        vmDisplay.classList.toggle("crt-canvas", retroEffect);
        if (retroEffect) {
          startCrtFlicker();
        } else {
          stopCrtFlicker();
          const canvas = vmDisplay.querySelector("canvas");
          if (canvas) canvas.style.removeProperty("filter");
          ["crt-bulge", "crt-scanlines", "crt-dotmask", "crt-phosphor"].forEach(cls => {
            const el = vmDisplay.querySelector(`.${cls}`);
            if (el) el.remove();
          });
        }
      };
      wrapper.appendChild(btn);
      btns.insertBefore(wrapper, btns.firstChild);
    } else {
      // Update button text to match state if already exists
      const btn = wrapper.querySelector("#crtBtn");
      if (btn) btn.textContent = retroEffect ? "🖥️ Normal Mode" : "📺 CRT Mode";
    }
  } catch (e) {
    console.error("[CRT Script] Error in addCrtBtn:", e);
  }
}

addCrtBtn();

})();

// ==UserScript==
// @name         Live2D Model Loader (Minimal, Unique Container)
// @namespace    http://tampermonkey.net/
// @version      2.3 // Updated version
// @description  Loads a floating Live2D model in a unique container, no UI, no messages, no buttons. Inspired by JanitorAI script.
// @author       Gemini
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543934/Live2D%20Model%20Loader%20%28Minimal%2C%20Unique%20Container%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543934/Live2D%20Model%20Loader%20%28Minimal%2C%20Unique%20Container%29.meta.js
// ==/UserScript==

// == Functions Section ==
const Functions = {
  enabled: true, // Set to false to disable model rendering
  followCursor: true, // If true, model watches the cursor; if false, it doesn't
};

(function () {
  "use strict";

  // Unique class/id names for this script
  const CONTAINER_ID = "unique-live2d-container";
  const CANVAS_ID = "unique-live2d-canvas";

  // Add minimal CSS for the container (bottom right, no UI)
  const MINIMAL_CSS = `
        #${CONTAINER_ID} {
            position: fixed;
            right: 0;
            bottom: 0;
            z-index: 999999;
            pointer-events: auto;
            cursor: grab;
            user-select: none;
            background: transparent !important;
            /* Let container size fit the canvas */
            width: fit-content;
            height: fit-content;
        }
        #${CONTAINER_ID}.dragging {
            cursor: grabbing;
        }
        #${CANVAS_ID} {
            display: block;
            pointer-events: none;
            /* Remove height/width so canvas uses its pixel size */
        }
    `;

  function addStyle(css) {
    const node = document.createElement("style");
    node.type = "text/css";
    node.appendChild(document.createTextNode(css));
    document.head.appendChild(node);
  }

  // Load external libraries in order
  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  const loadLibs = async () => {
    await loadScript(
      "https://cdn.jsdelivr.net/npm/greensock@1.20.2/dist/TweenLite.js"
    );
    await loadScript(
      "https://cdn.jsdelivr.net/gh/dylanNew/live2d/webgl/Live2D/lib/live2d.min.js"
    ); // Required for Cubism 2 runtime
    await loadScript(
      "https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js"
    );
    await loadScript(
      "https://cdn.jsdelivr.net/npm/pixi.js@7.4.2/dist/pixi.min.js"
    );
    await loadScript(
      "https://cdn.jsdelivr.net/npm/pixi-live2d-display-lipsyncpatch@0.5.0-ls-8/dist/index.min.js"
    );
  };

  // Create container and canvas with fixed size
  function createContainer() {
    let container = document.getElementById(CONTAINER_ID);
    if (!container) {
      container = document.createElement("div");
      container.id = CONTAINER_ID;
      document.body.appendChild(container);
    }
    let canvas = document.getElementById(CANVAS_ID);
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.id = CANVAS_ID;
      // Set your desired canvas size here
      canvas.width = 400;
      canvas.height = 400;
      container.appendChild(canvas);
    }
    // Add drag functionality
    makeDraggable(container);
    return canvas;
  }

  // Drag-and-drop logic for the container
  function makeDraggable(element) {
    let isDragging = false;
    let startX, startY, startRight, startBottom;

    element.addEventListener("mousedown", function (e) {
      // Only left mouse button
      if (e.button !== 0) return;
      isDragging = true;
      element.classList.add("dragging");
      startX = e.clientX;
      startY = e.clientY;
      // Get current right/bottom in px
      const rect = element.getBoundingClientRect();
      startRight = window.innerWidth - rect.right;
      startBottom = window.innerHeight - rect.bottom;
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
      e.preventDefault();
    });

    function onMouseMove(e) {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      // Update right and bottom
      let newRight = startRight - dx;
      let newBottom = startBottom - dy;
      // Clamp to window
      newRight = Math.max(0, Math.min(window.innerWidth - 40, newRight));
      newBottom = Math.max(0, Math.min(window.innerHeight - 40, newBottom));
      element.style.right = newRight + "px";
      element.style.bottom = newBottom + "px";
    }

    function onMouseUp() {
      isDragging = false;
      element.classList.remove("dragging");
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    }
  }

  // Store the latest blobUrl for TTS audio
  let latestTTSBlobUrl = null;
  let live2dModel = null;

  // Listen for TTSStopPlayback event from the other script
  window.addEventListener("TTSStopPlayback", function () {
    if (live2dModel && typeof live2dModel.stopSpeaking === "function") {
      try {
        live2dModel.stopSpeaking();
      } catch (err) {
        console.error("Error calling stopSpeaking() on live2dModel:", err);
      }
    }
  });

  // Listen for TTSBlobUrlReady event from the other script
  window.addEventListener("TTSBlobUrlReady", function (e) {
    if (e && e.detail && e.detail.blobUrl) {
      latestTTSBlobUrl = e.detail.blobUrl;
      // If model is loaded, trigger lipsync with new audio
      if (live2dModel && live2dModel.speak) {
        try {
          live2dModel.speak(latestTTSBlobUrl, {
            volume: 0.7,
            crossOrigin: "anonymous",
            onFinish: () => {
              console.log("Live2D lipsync finished for blobUrl.");
            },
            onError: (err) => {
              console.error("Live2D lipsync error for blobUrl:", err);
            },
          });
        } catch (err) {
          console.error("Error calling speak() with blobUrl:", err);
        }
      }
    }
  });

  // Load and display the Live2D model, allow easy scaling/positioning
  function loadLive2DModel(canvasId, modelUrl) {
    const app = new PIXI.Application({
      view: document.getElementById(canvasId),
      transparent: true,
      backgroundAlpha: 0,
      autoStart: true,
      width: 900, // match canvas size
      height: 900,
    });
    const canvas = document.getElementById(canvasId);
    let model = PIXI.live2d.Live2DModel.fromSync(modelUrl, {
      autoFocus: !!Functions.followCursor,
      autoHitTest: !!Functions.followCursor,
    });
    model.once("load", () => {
      app.stage.addChild(model);
      // Set your desired scale and position here
      // Example: scale to 2x, center in canvas
      const scale = 0.5;
      model.scale.set(scale);
      model.x = canvas.width / 2;
      model.y = canvas.height / 2;
      model.anchor.set(0.5, 0.5);

      // Optionally, expose for debugging
      window.live2dModel = model;

      try {
        const settings = model.internalModel && model.internalModel.settings;
        if (settings) {
          // Improved Fetching Motions
          if (settings.motions) {
            const allMotions = {};
            for (const [group, motionsArray] of Object.entries(
              settings.motions
            )) {
              allMotions[group] = motionsArray.map((motion, idx) => ({
                index: idx,
                ...motion,
              }));
            }
            console.log("Live2D Model Motions (settings.motions):", allMotions);
          } else {
            console.warn(
              "No motions found in model.internalModel.settings.motions."
            );
          }

          if (settings.hitAreas) {
            const allHitAreas = settings.hitAreas;
            console.log(
              "Live2D Model Hit Areas (settings.hitAreas):",
              allHitAreas
            );
          } else {
            console.warn(
              "No hit areas found in model.internalModel.settings.hitAreas."
            );
          }
        } else {
          console.warn("Model settings not found.");
        }
      } catch (e) {
        console.error("Error fetching data from settings:", e);
      }
    });
    return model;
  }

  // Main execution
  (async function () {
    if (!Functions.enabled) {
      const container = document.getElementById(CONTAINER_ID);
      if (container) container.remove();
      return;
    }
    addStyle(MINIMAL_CSS);
    await loadLibs();
    const canvas = createContainer();
    const MODEL_URL =
      "https://cdn.jsdelivr.net/gh/guansss/pixi-live2d-display/test/assets/shizuku/shizuku.model.json";
    live2dModel = loadLive2DModel(CANVAS_ID, MODEL_URL);
  })();
})();

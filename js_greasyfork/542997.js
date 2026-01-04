// ==UserScript==
// @name         Internet Roadtrip: "Greetings from" popup
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @author       joawatte19
// @description  Show vintage post card/"Greetings from.." location name popup on https://neal.fun/internet-roadtrip/
// @match        https://neal.fun/internet-roadtrip/
// @license      MIT
// @grant        none
// @run-at       document-end
// @require      https://cdn.jsdelivr.net/npm/internet-roadtrip-framework@0.4.1-beta
// @downloadURL https://update.greasyfork.org/scripts/542997/Internet%20Roadtrip%3A%20%22Greetings%20from%22%20popup.user.js
// @updateURL https://update.greasyfork.org/scripts/542997/Internet%20Roadtrip%3A%20%22Greetings%20from%22%20popup.meta.js
// ==/UserScript==

(async () => {
  if (!IRF?.isInternetRoadtrip) return;

  const container = await IRF.vdom.container;
  window.container = container;
  const originalUpdateData = container.methods.updateData;

  let lastLoc = {};
  let shown = {
    neighborhood: null,
    county: null
  };


  container.state.updateData = new Proxy(originalUpdateData, {
    apply: (target, thisArg, args) => {
      const result = Reflect.apply(target, thisArg, args);

      const loc = container.state.currentLocation;
      const fields = ["neighborhood", "county", "state", "country"];

      const changedFields = fields.filter(field => loc?.[field] && loc[field] !== lastLoc[field]);
      lastLoc = { ...loc };

      if (changedFields.length) {
        const field = changedFields[0];
        const title = loc[field];

        const fieldHierarchy = {
          neighborhood: "county",
          county: "state",
          state: "country",
          country: "state"
        };

        const parentField = fieldHierarchy[field];
        const subtitle = loc[parentField] && loc[parentField] !== title ? loc[parentField] : "";

        const isOnceOnly = ["neighborhood", "county"].includes(field);
        const wasShownBefore = shown[field] === title;

        if (!isOnceOnly || !wasShownBefore) {
          showPopup(title, subtitle);
          if (isOnceOnly) shown[field] = title;
        }
      }

      return result;
    }
  });


// Load fonts once at script start
const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Anton&family=Pacifico&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

function showPopup(title, subtitle = "") {
  const existing = document.getElementById("ds-location-popup");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.id = "ds-overlay";
  Object.assign(overlay.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100vw",
    height: "100vh",
    backgroundColor: "#000",
    opacity: "0",
    zIndex: 9998,
    pointerEvents: "none",
    transition: "opacity 1.2s ease-in-out",
  });
  document.body.appendChild(overlay);
  requestAnimationFrame(() => {
    overlay.style.opacity = "0.4";
  });

  // Load fonts
  const fontLink = document.createElement("link");
  fontLink.href = "https://fonts.googleapis.com/css2?family=Anton&family=Pacifico&display=swap";
  fontLink.rel = "stylesheet";
  document.head.appendChild(fontLink);

  // Create popup
  const popup = document.createElement("div");
  popup.id = "ds-location-popup";
  popup.innerHTML = `
    <div style="font-family: 'Pacifico', cursive; font-size: 2.5rem; color: #002B5B; margin-bottom: 0.5rem;">
      Greetings from
    </div>
<svg viewBox="0 0 1200 600" style="width: 100%; max-width: 1200; height: auto; transform: rotate(-8deg); display: block; margin: 0 auto;">
  <defs>
    <pattern id="bgImage" patternUnits="userSpaceOnUse" width="1200" height="600">
      <image href="https://files.catbox.moe/2rlllj.png" x="0" y="0" width="1200" height="600" preserveAspectRatio="xMidYMid slice" />
    </pattern>
    <path id="textPath" d="M10,500 Q500,100 1300,300" fill="none" />
  </defs>

  <!-- Orange 3D shadow -->
  <text fill="orange" font-size="300" font-family="Anton, sans-serif" letter-spacing="-2">
    <textPath href="#textPath" startOffset="50%" text-anchor="middle">
      ${title}
    </textPath>
  </text>

  <!-- White outline -->
  <text fill="white" stroke="white" stroke-width="10" font-size="299" font-family="Anton, sans-serif" letter-spacing="-2">
    <textPath href="#textPath" startOffset="50%" text-anchor="middle">
      ${title}
    </textPath>
  </text>

  <!-- Clipped image fill -->
  <text fill="url(#bgImage)" font-size="298" font-family="Anton, sans-serif" letter-spacing="-2">
    <textPath href="#textPath" startOffset="50%" text-anchor="middle">
      ${title}
    </textPath>
  </text>
</svg>

    ${subtitle ? `<div style="font-family: 'Pacifico', cursive; font-size: 2rem; color: #002B5B; margin-top: 0.5rem;">${subtitle}</div>` : ""}
  `;

  Object.assign(popup.style, {
    position: "fixed",
    top: "40%",
    left: "50%",
    transform: "translate(-50%, -50%) scale(0.95)",
    whiteSpace: "normal",
    maxWidth: "90vw",
    textAlign: "center",
    userSelect: "none",
    zIndex: 9999,
    opacity: "0",
    transition: "opacity 1.2s ease-in-out, transform 1.2s ease-in-out",
    pointerEvents: "none",
    padding: "1rem",
    borderBottom: "4px solid rgba(227,226,224,0.5)",
  });

  document.body.appendChild(popup);
  requestAnimationFrame(() => {
    popup.style.opacity = "1";
    popup.style.transform = "translate(-50%, -50%) scale(1)";
  });



  // fade out
  setTimeout(() => {
    popup.style.opacity = "0";
    popup.style.transform = "translate(-50%, -50%) scale(1.05) rotate(-2deg)";
    overlay.style.opacity = "0";
    setTimeout(() => {
      popup.remove();
      overlay.remove();
    }, 1500);
  }, 3000);
}


  window.showPopup = showPopup;

  // manual trigger with console
  window.showDSLocationPopup = () => {
    const loc = container.state.currentLocation;
    if (!loc) {
      console.warn("No location data available.");
      return;
    }

    const fields = ["neighborhood", "county", "state", "country"];
    for (const field of fields) {
      if (loc[field]) {
        showPopup(loc[field]);
        break;
      }
    }
  };
})();


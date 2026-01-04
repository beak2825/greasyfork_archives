// ==UserScript==
// @name Wikipedia Reading Mode
// @namespace https://santus.dev/
// @description Read Wikipedia like you mean it.
// @author Krisantus Wanandi (https://github.com/krisantuswanandi)
// @match *://*.wikipedia.org/**
// @icon https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org
// @run-at document-body
// @license MIT
// @supportURL https://github.com/krisantuswanandi/wikipedia-reading-mode
// @version 0.0.1-alpha.3
// @downloadURL https://update.greasyfork.org/scripts/491169/Wikipedia%20Reading%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/491169/Wikipedia%20Reading%20Mode.meta.js
// ==/UserScript==

(function () {

"use strict";

// src/style.ts
function injectStyle() {
  const style = document.createElement("style");
  style.innerHTML = `
body.wrm-enabled {
  #mw-page-base,
  #my-page-base,
  #mw-navigation,
  #footer,
  #toc,
  .infobox,
  .mw-indicators,
  #siteSub
  {
    display: none;
  }

  #content {
    font-family: serif;
    margin-left: 0;
  }

  #content .vector-body {
    font-size: 16px;
  }
}

#wrm-toolbar {
  align-items: center;
  background-color: #fff;
  border-radius: 100px;
  border: 1px solid #ddd;
  bottom: 8px;
  box-shadow: 0 8px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  gap: 4px;
  justify-content: center;
  left: 50%;
  transform: translateX(-50%);
  margin: 0 auto;
  padding: 4px;
  position: fixed;
  z-index: 1000;
}

.wrm-toolbar-button {
  background-color: transparent;
  border: none;
  border-radius: 100px;
  color: #fff;
  cursor: pointer;
  font-size: 16px;
  width: 40px;
  height: 40px;
  padding: 8px;

  svg {
    width: 100%;
    height: 100%;
    color: #000;
  }
}
.wrm-toolbar-button:hover {
  background-color: #f0f0f0;
}

.wrm-toolbar-popup {
  position: fixed;
  bottom: 64px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #fff;
  border-radius: 12px;
  border: 1px solid #ddd;
  box-shadow: 0 8px 8px rgba(0, 0, 0, 0.2);
  padding: 16px;
  width: 200px;
  z-index: 1000;
}
.wrm-toolbar-popup.hidden {
  display: none;
}
.wrm-toolbar-popup.coming-soon:before {
  display: flex;
  height: 100px;
  justify-content: center;
  align-items: center;
  color: #bbb;
  font-style: italic;
  content: "Coming soon";
}

.wrm-settings-item {
  display: flex;
  justify-content: space-between;
}
`;
  document.head.appendChild(style);
}

// src/utils.ts
function useVectorSkin() {
  const SKIN_KEY = "useskin";
  const SKIN_VAL = "vector";
  const search = new URLSearchParams(window.location.search);
  const skin = search.get(SKIN_KEY);
  const isVectorSkin = skin === SKIN_VAL;
  if (!isVectorSkin) {
    const newurl = new URL(window.location.href);
    newurl.searchParams.set(SKIN_KEY, SKIN_VAL);
    window.location.href = newurl.toString();
  }
  return isVectorSkin;
}

// src/icons/font.ts
var font_default = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 14h-5m0 2v-3.5a2.5 2.5 0 0 1 5 0V16M4.5 13h6M3 16l4.5-9l4.5 9"/></svg>`;

// src/toolbar/display.ts
var toolbarPopup = document.createElement("div");
toolbarPopup.classList.add("wrm-toolbar-popup");
toolbarPopup.classList.add("coming-soon");
toolbarPopup.classList.add("hidden");
document.body.appendChild(toolbarPopup);
var menu = document.createElement("button");
menu.innerHTML = font_default;
menu.classList.add("wrm-toolbar-button");
menu.addEventListener("click", () => {
  const popups = document.querySelectorAll(".wrm-toolbar-popup");
  popups.forEach((popup) => {
    if (popup !== toolbarPopup) {
      popup.classList.add("hidden");
    }
  });
  toolbarPopup.classList.toggle("hidden");
});
var display_default = menu;

// src/icons/list.ts
var list_default = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>`;

// src/toolbar/contents.ts
var toolbarPopup2 = document.createElement("div");
toolbarPopup2.classList.add("wrm-toolbar-popup");
toolbarPopup2.classList.add("coming-soon");
toolbarPopup2.classList.add("hidden");
document.body.appendChild(toolbarPopup2);
var menu2 = document.createElement("button");
menu2.innerHTML = list_default;
menu2.classList.add("wrm-toolbar-button");
menu2.addEventListener("click", () => {
  const popups = document.querySelectorAll(".wrm-toolbar-popup");
  popups.forEach((popup) => {
    if (popup !== toolbarPopup2) {
      popup.classList.add("hidden");
    }
  });
  toolbarPopup2.classList.toggle("hidden");
});
var contents_default = menu2;

// src/icons/ellipsis.ts
var ellipsis_default = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></g></svg>`;

// src/toolbar/settings.ts
var enableButton = document.createElement("input");
enableButton.type = "checkbox";
enableButton.checked = true;
enableButton.addEventListener("change", (event) => {
  const target = event.target;
  if (target && target.checked) {
    document.body.classList.add("wrm-enabled");
  } else {
    document.body.classList.remove("wrm-enabled");
  }
});
window.addEventListener("keydown", (event) => {
  if (event.key.toLowerCase() === "x") {
    enableButton.checked = !enableButton.checked;
    enableButton.dispatchEvent(new Event("change"));
  }
});
var enableTitle = document.createElement("div");
enableTitle.innerHTML = "Enabled (x)";
var settingsItem = document.createElement("div");
settingsItem.classList.add("wrm-settings-item");
settingsItem.appendChild(enableTitle);
settingsItem.appendChild(enableButton);
var toolbarPopup3 = document.createElement("div");
toolbarPopup3.classList.add("wrm-toolbar-popup");
toolbarPopup3.classList.add("hidden");
toolbarPopup3.appendChild(settingsItem);
document.body.appendChild(toolbarPopup3);
var menu3 = document.createElement("button");
menu3.innerHTML = ellipsis_default;
menu3.classList.add("wrm-toolbar-button");
menu3.addEventListener("click", () => {
  const popups = document.querySelectorAll(".wrm-toolbar-popup");
  popups.forEach((popup) => {
    if (popup !== toolbarPopup3) {
      popup.classList.add("hidden");
    }
  });
  toolbarPopup3.classList.toggle("hidden");
});
var settings_default = menu3;

// src/toolbar/index.ts
function addToolbar() {
  const toolbar = document.createElement("div");
  toolbar.id = "wrm-toolbar";
  toolbar.appendChild(display_default);
  toolbar.appendChild(contents_default);
  toolbar.appendChild(settings_default);
  document.body.appendChild(toolbar);
}

// src/index.ts
var init = function() {
  if (!useVectorSkin())
    return;
  injectStyle();
  addToolbar();
  document.body.classList.add("wrm-enabled");
};
init();

})();

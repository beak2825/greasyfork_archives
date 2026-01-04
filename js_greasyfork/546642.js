// ==UserScript==
// @name           Wplace Map Themes
// @name:fr        Wplace Map Themes
// @namespace      https://github.com/CreepsoOff/wplace-dark-themes
// @version        0.0.1
// @description    Switch Wplace map between 4 themes
// @description:fr Basculer entre les 4 thèmes de la map wplace
// @author         Creepso
// @match          *://*.wplace.live/*
// @icon           https://www.google.com/s2/favicons?sz=64&domain=wplace.live
// @run-at         document-start
// @license        GPL-3.0 license
// @downloadURL https://update.greasyfork.org/scripts/546642/Wplace%20Map%20Themes.user.js
// @updateURL https://update.greasyfork.org/scripts/546642/Wplace%20Map%20Themes.meta.js
// ==/UserScript==

(() => {
  "use strict";

  // Available themes
  const themesMap = {
    liberty_wplace: {
      url: "https://maps.wplace.live/styles/liberty",
      iconColor: "#000000",
      buttonBackground: "#ffffff",
      name: "Liberty Wplace",
    },
    bright_wplace: {
      url: "https://maps.wplace.live/styles/bright",
      iconColor: "#000000",
      buttonBackground: "#ffffff",
      name: "Bright Wplace",
    },
    dark_black_wplace: {
      url: "https://maps.wplace.live/styles/dark",
      iconColor: "#ffffff",
      buttonBackground: "#000000",
      name: "Dark Black Wplace",
    },
    dark_blue_wplace: {
      url: "https://maps.wplace.live/styles/fiord",
      iconColor: "#ffffff",
      buttonBackground: "#000055",
      name: "Dark Blue Wplace",
    },
  };

  const defaultTheme = "liberty_wplace";
  const originalThemeUrl = "https://maps.wplace.live/styles/liberty";

  // Load stored theme or fallback to default
  const stored = localStorage.getItem("MapTheme");
  const mapTheme = stored && themesMap[stored] ? stored : defaultTheme;
  const selectedTheme = themesMap[mapTheme];

  // Override fetch to replace style URL
  const __ufetch = unsafeWindow.fetch;
  unsafeWindow.fetch = function (configArg, ...restArg) {
    const url =
      (typeof configArg === "string" && configArg) ||
      (configArg && configArg.url) ||
      "";
    if (url === originalThemeUrl) {
      return __ufetch(selectedTheme.url);
    }
    return __ufetch(configArg, ...restArg);
  };

  // Handle theme change
  unsafeWindow.changeMapTheme = function (event) {
    const theme = event.target.getAttribute("data-theme");
    if (!themesMap[theme]) return;
    localStorage.setItem("MapTheme", theme);
    location.reload();
  };

  // Add theme button and dropdown
  const observer = new MutationObserver((_, obs) => {
    const host = document.querySelector("div.flex.flex-col.items-center.gap-3");
    if (!host) return;

    obs.disconnect();

    const items = Object.entries(themesMap)
      .map(([id, t]) => {
        const active = mapTheme === id ? ' style="font-weight:600;"' : "";
        return `<li><a${active} data-theme="${id}" onclick="window.changeMapTheme(event);">${t.name}</a></li>`;
      })
      .join("");

    const mount = document.createElement("div");
    host.appendChild(mount);
    mount.outerHTML = `
      <div class="dropdown dropdown-end">
        <button class="btn btn-square relative shadow-md" tabindex="0" title="Map Theme"
                style="background-color:${selectedTheme.buttonBackground}">
          <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
               fill="${selectedTheme.iconColor}">
            <path d="M12 11.807A9.002 9.002 0 0 1 10.049 2a9.942 9.942 0 0 0-5.12 2.735c-3.905 3.905-3.905 10.237 0 14.142 3.906 3.906 10.237 3.905 14.143 0a9.946 9.946 0 0 0 2.735-5.119A9.003 9.003 0 0 1 12 11.807z"/>
          </svg>
        </button>
        <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
          ${items}
        </ul>
      </div>
    `;
  });

  observer.observe(document, { childList: true, subtree: true });
})();

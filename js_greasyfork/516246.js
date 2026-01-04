// ==UserScript==
// @name         Font Awesome Pro Downloader
// @description  Adds download and copy buttons for Font Awesome Pro icons.
// @icon         https://fontawesome.com/images/favicon/icon.svg
// @version      1.6
// @author       afkarxyz
// @namespace    https://github.com/afkarxyz/userscripts/
// @supportURL   https://github.com/afkarxyz/userscripts/issues
// @license      MIT
// @match        https://fontawesome.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/516246/Font%20Awesome%20Pro%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/516246/Font%20Awesome%20Pro%20Downloader.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const CACHE_KEY_PREFIX = "FA_SVG_CACHE_";
  const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000;

  const DOWNLOAD_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="12" height="12"><path d="M378.1 198.6L249.5 341.4c-6.1 6.7-14.7 10.6-23.8 10.6l-3.5 0c-9.1 0-17.7-3.8-23.8-10.6L69.9 198.6c-3.8-4.2-5.9-9.8-5.9-15.5C64 170.4 74.4 160 87.1 160l72.9 0 0-128c0-17.7 14.3-32 32-32l64 0c17.7 0 32 14.3 32 32l0 128 72.9 0c12.8 0 23.1 10.4 23.1 23.1c0 5.7-2.1 11.2-5.9 15.5zM64 352l0 64c0 17.7 14.3 32 32 32l256 0c17.7 0 32-14.3 32-32l0-64c0-17.7 14.3-32 32-32s32 14.3 32 32l0 64c0 53-43 96-96 96L96 512c-53 0-96-43-96-96l0-64c0-17.7 14.3-32 32-32s32 14.3 32 32z"/></svg>`;
  const COPY_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="12" height="12"><path d="M192 0c-41.8 0-77.4 26.7-90.5 64L64 64C28.7 64 0 92.7 0 128L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64l-37.5 0C269.4 26.7 233.8 0 192 0zm0 64a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM72 272a24 24 0 1 1 48 0 24 24 0 1 1 -48 0zm104-16l128 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-128 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zM72 368a24 24 0 1 1 48 0 24 24 0 1 1 -48 0zm88 0c0-8.8 7.2-16 16-16l128 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-128 0c-8.8 0-16-7.2-16-16z"/></svg>`;
  const SUCCESS_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="12" height="12"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>`;

  const processedIcons = new WeakSet();

  function showSuccessAnimation(button) {
    const originalContent = button.innerHTML;
    const parser = new DOMParser();
    const successSvg = parser.parseFromString(SUCCESS_ICON, "image/svg+xml");

    button.innerHTML = "";
    button.appendChild(successSvg.documentElement);

    setTimeout(() => {
      button.innerHTML = originalContent;
    }, 250);
  }

  function clearExpiredCache() {
    const currentTime = Date.now();
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(CACHE_KEY_PREFIX)) {
        try {
          const cachedItem = JSON.parse(localStorage.getItem(key));
          if (currentTime - cachedItem.timestamp > CACHE_DURATION) {
            localStorage.removeItem(key);
          }
        } catch (error) {
          console.error("Error clearing cache:", error);
        }
      }
    }
  }

  function getCachedSVG(url) {
    clearExpiredCache();
    const cacheKey = CACHE_KEY_PREFIX + btoa(url);
    const cachedItem = localStorage.getItem(cacheKey);

    if (cachedItem) {
      try {
        const parsedItem = JSON.parse(cachedItem);
        return parsedItem.content;
      } catch (error) {
        console.error("Error parsing cached SVG:", error);
        return null;
      }
    }
    return null;
  }

  function cacheSVG(url, svgContent) {
    const cacheKey = CACHE_KEY_PREFIX + btoa(url);
    const cacheItem = {
      content: svgContent,
      timestamp: Date.now(),
    };

    try {
      localStorage.setItem(cacheKey, JSON.stringify(cacheItem));
    } catch (error) {
      console.error("Error caching SVG:", error);
    }
  }

  async function fetchAndCacheSVG(url, iconStyle, iconName) {
    const cachedSVG = getCachedSVG(url);
    if (cachedSVG) return cachedSVG;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 403 || response.status === 404) {
          let fallbackUrl = null;

          if (iconStyle === "duotone-solid") {
            fallbackUrl = url.replace("duotone-solid", "duotone");
          } else if (iconStyle === "sharp-thin") {
            fallbackUrl = url.replace("sharp-thin", "sharp-light");
          } else if (
            !["solid", "regular", "light", "thin", "brands"].includes(iconStyle)
          ) {
            fallbackUrl = url.replace(`/${iconStyle}/`, "/solid/");
          }

          if (fallbackUrl) {
            console.log(`Retrying with fallback style: ${fallbackUrl}`);
            const retryResponse = await fetch(fallbackUrl);
            if (!retryResponse.ok)
              throw new Error("Network response was not ok.");
            let svgContent = await retryResponse.text();
            svgContent = svgContent.replace(/<!--[\s\S]*?-->/g, "");
            cacheSVG(url, svgContent);
            return svgContent;
          }
        }
        throw new Error("Network response was not ok.");
      }
      let svgContent = await response.text();
      svgContent = svgContent.replace(/<!--[\s\S]*?-->/g, "");
      cacheSVG(url, svgContent);
      return svgContent;
    } catch (error) {
      console.error("Error fetching SVG:", error);
      throw error;
    }
  }

  async function copySVG(url, button, iconStyle, iconName) {
    try {
      const svgContent = await fetchAndCacheSVG(url, iconStyle, iconName);
      await navigator.clipboard.writeText(svgContent);
      showSuccessAnimation(button);
    } catch (error) {
      const errorMessage = `Failed to copy SVG: ${error.message}`;
      console.error(errorMessage);
      alert(errorMessage);
    }
  }

  async function downloadSVG(url, filename, button, iconStyle, iconName) {
    try {
      const svgContent = await fetchAndCacheSVG(url, iconStyle, iconName);
      const blob = new Blob([svgContent], { type: "image/svg+xml" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
      showSuccessAnimation(button);
    } catch (error) {
      console.error("Failed to download SVG:", error);
      alert("Failed to download SVG. Check the console for details.");
    }
  }

  function getSelectedVersion() {
    const selectElement = document.getElementById(
      "choose_aversionoffontawesome"
    );
    if (selectElement?.value) return selectElement.value.trim();

    const styleLink = document.querySelector(
      'link[rel="stylesheet"][href*="fontawesome.com/releases"]'
    );
    const versionMatch = styleLink
      ?.getAttribute("href")
      ?.match(/releases\/v([\d.]+)/);

    return versionMatch?.[1] || "7.0.0";
  }

  function parseVersion(versionString) {
    const parts = versionString.split(".").map(Number);
    return {
      major: parts[0] || 0,
      minor: parts[1] || 0,
      patch: parts[2] || 0,
      full: versionString,
      isV7OrHigher: parts[0] >= 7,
      isV6OrLower: parts[0] <= 6,
    };
  }

  function getUrlPath(version) {
    const versionInfo = parseVersion(version);
    return versionInfo.isV7OrHigher ? "svgs-full" : "svgs";
  }

  function createButton(icon, title, className) {
    const button = document.createElement("span");
    button.className = `fa-icon-button ${className}`;
    button.title = title;
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(icon, "image/svg+xml");
    button.appendChild(svgDoc.documentElement);
    return button;
  }

  function getIconStyle(iconElement, version = null) {
    const classes = new Set(iconElement.classList);
    const versionInfo = version
      ? parseVersion(version)
      : parseVersion(getSelectedVersion());

    if (classes.has("fa-brands")) return "brands";

    if (versionInfo.isV7OrHigher) {
      const newStyleMap = {
        "fa-chisel": "chisel-regular",
        "fa-etch": "etch-solid",
        "fa-jelly": "jelly-regular",
        "fa-jelly-duo": "jelly-duo-regular",
        "fa-jelly-fill": "jelly-fill-regular",
        "fa-notdog": "notdog-solid",
        "fa-notdog-duo": "notdog-duo-solid",
        "fa-slab": "slab-regular",
        "fa-slab-press": "slab-press-regular",
        "fa-thumbprint": "thumbprint-light",
        "fa-whiteboard": "whiteboard-semibold",
      };

      for (const [className, styleName] of Object.entries(newStyleMap)) {
        if (classes.has(className)) {
          return styleName;
        }
      }
    }

    const baseStyleMap = {
      "fa-solid": "solid",
      "fa-light": "light",
      "fa-thin": "thin",
      "fa-regular": "regular",
    };

    let style = "";

    if (classes.has("fa-duotone")) {
      style = "duotone";
      for (const [className, styleName] of Object.entries(baseStyleMap)) {
        if (classes.has(className)) {
          return styleName === "solid" ? "duotone" : `duotone-${styleName}`;
        }
      }
      return "duotone";
    }

    if (classes.has("fa-sharp")) {
      if (classes.has("fa-duotone")) {
        style = "sharp-duotone";
        for (const [className, styleName] of Object.entries(baseStyleMap)) {
          if (classes.has(className)) {
            return `sharp-duotone-${styleName}`;
          }
        }
        return "sharp-duotone-solid";
      } else {
        style = "sharp";
        for (const [className, styleName] of Object.entries(baseStyleMap)) {
          if (classes.has(className)) {
            return `sharp-${styleName}`;
          }
        }
        return "sharp-solid";
      }
    }

    for (const [className, styleName] of Object.entries(baseStyleMap)) {
      if (classes.has(className)) {
        return styleName;
      }
    }

    return "solid";
  }

  function processIcon(icon) {
    if (processedIcons.has(icon)) return;

    const iconElement = icon.querySelector("i");
    const iconNameElement = icon.querySelector(".icon-name");

    if (!iconElement || !iconNameElement?.textContent) return;

    const iconName = iconNameElement.textContent.trim();

    if (!iconElement || !iconName) {
      return;
    }

    const version = getSelectedVersion();
    const iconStyle = getIconStyle(iconElement, version);
    const urlPath = getUrlPath(version);
    const url = `https://site-assets.fontawesome.com/releases/v${version}/${urlPath}/${iconStyle}/${iconName}.svg`;
    const filename =
      iconStyle === "brands"
        ? `${iconName}.svg`
        : `${iconName}_${iconStyle}.svg`;

    const container = document.createElement("div");
    container.className = "fa-buttons-container";

    const downloadButton = createButton(
      DOWNLOAD_ICON,
      "Download SVG",
      "fa-download-button"
    );
    const copyButton = createButton(COPY_ICON, "Copy SVG", "fa-copy-button");

    downloadButton.addEventListener("click", () =>
      downloadSVG(url, filename, downloadButton, iconStyle, iconName)
    );
    copyButton.addEventListener("click", () =>
      copySVG(url, copyButton, iconStyle, iconName)
    );

    container.appendChild(copyButton);
    container.appendChild(downloadButton);

    let tagContainer = icon.querySelector(".tag");
    if (!tagContainer) {
      tagContainer = document.createElement("div");
      tagContainer.className = "tag";
    }

    tagContainer.innerHTML = "";

    tagContainer.appendChild(container);

    const buttonElement = icon.querySelector("button");
    if (buttonElement && !buttonElement.parentNode.querySelector(".tag")) {
      buttonElement.parentNode.insertBefore(
        tagContainer,
        buttonElement.nextSibling
      );
    }

    processedIcons.add(icon);
  }

  function processAllIcons(icons) {
    Array.from(icons).forEach((icon) => {
      if (!processedIcons.has(icon)) {
        processIcon(icon);
      }
    });
  }

  function setupMutationObserver() {
    const observer = new MutationObserver(() => {
      const icons = document.querySelectorAll("article.wrap-icon");
      processAllIcons(icons);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  const style = document.createElement("style");
  style.textContent = `
        .fa-buttons-container {
            display: inline-flex;
            gap: 3px;
            align-items: center;
            justify-content: center;
            min-width: 50px;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
        }
        .tag {
            display: flex;
            justify-content: center;
            position: relative;
            min-height: 28px;
            padding: 0 4px !important;
            margin: 0 !important;
            background: transparent !important;
        }
        .fa-icon-button {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 20px;
            height: 20px;
            border-radius: 4px;
            background-color: var(--fa-yellow);
            color: var(--fa-navy);
            cursor: pointer;
            padding: 3px;
        }
        .fa-icon-button svg {
            width: 100%;
            height: 100%;
        }
        .fa-icon-button svg path {
            fill: var(--fa-navy);
        }
    `;

  document.head.appendChild(style);

  const initialIcons = document.querySelectorAll("article.wrap-icon");
  processAllIcons(initialIcons);
  setupMutationObserver();
})();
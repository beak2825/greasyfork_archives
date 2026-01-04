// ==UserScript==
// @name         BetterTriangulet
// @version      Beta 1.4.3
// @description  once...
// @icon         https://coplic.com/media/misc/favicon.png
// @author       C00LESTKIDDEVER
// @match        *://tri.pengpowers.xyz/*
// @match        https://coplic.com/*
// @grant        none
// @namespace https://greasyfork.org/users/1479014
// @downloadURL https://update.greasyfork.org/scripts/541675/BetterTriangulet.user.js
// @updateURL https://update.greasyfork.org/scripts/541675/BetterTriangulet.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const themeColors = {
    Purple: "#4d136b",
    Green: "#265b09",
    Blue: "#132a6b",
    Red: "#6b1313",
    Orange: "#6b3b13",
    Yellow: "#6b6a13",
    Pink: "#6b134a",
    White: "#e6e6e6",
    Black: "#000000",
  };

  function getThemeColor() {
    const theme = localStorage.getItem("theme");
    return themeColors[theme] || "var(--container)";
  }

  function replaceBackgrounds(enable) {
    const allElements = document.querySelectorAll("*");
    allElements.forEach((el) => {
      if (el.style.backgroundImage && el.style.backgroundImage.includes("/media/misc/background.png")) {
        if (enable) {
          el.style.backgroundImage = el.style.backgroundImage.replace(/\/media\/misc\/background\.png/g, "/media/misc/aprilbackground.png");
        } else {
          el.style.backgroundImage = el.style.backgroundImage.replace(/\/media\/misc\/aprilbackground\.png/g, "/media/misc/background.png");
        }
      }
      if (el.style.background && el.style.background.includes("/media/misc/background.png")) {
        if (enable) {
          el.style.background = el.style.background.replace(/\/media\/misc\/background\.png/g, "/media/misc/aprilbackground.png");
        } else {
          el.style.background = el.style.background.replace(/\/media\/misc\/aprilbackground\.png/g, "/media/misc/background.png");
        }
      }
    });
    if (enable) {
      document.body.style.backgroundImage = "url('/media/misc/aprilbackground.png')";
      const fullContainer = document.querySelector(".styles__fullContainer___3Wl6C-camelCase");
      if (fullContainer) {
        fullContainer.style.backgroundImage = "url('/media/misc/aprilbackground.png')";
      }
    } else {
      document.body.style.backgroundImage = "url('/media/misc/background.png')";
      const fullContainer = document.querySelector(".styles__fullContainer___3Wl6C-camelCase");
      if (fullContainer) {
        fullContainer.style.backgroundImage = "url('/media/misc/background.png')";
      }
    }
  }

  function toggleFlip(enabled) {
    const prefixes = [
      "arts__profileBody___",
      "styles__sidebar___",
      "arts__header___",
      "arts__footer___",
    ];
    prefixes.forEach((prefix) => {
      const elements = [...document.querySelectorAll(`[class^='${prefix}']`)];
      elements.forEach((el) => {
        if (enabled) {
          el.style.transform = "rotate(180deg)";
          el.style.transformOrigin = "center center";
          el.style.transformStyle = "preserve-3d";
          el.style.backfaceVisibility = "hidden";
          el.style.transition = "transform 0.3s ease";
          el.style.overflow = "hidden";
        } else {
          el.style.transform = "";
          el.style.transformOrigin = "";
          el.style.transformStyle = "";
          el.style.backfaceVisibility = "";
          el.style.transition = "none";
          el.style.overflow = "";
        }
      });
    });

    replaceBackgrounds(enabled);
  }

  function applyQuickCSS(css) {
    let styleTag = document.getElementById("betterTrianguletQuickCSS");
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = "betterTrianguletQuickCSS";
      document.head.appendChild(styleTag);
    }
    styleTag.textContent = css || "";
  }

  function injectQuickCSSPanel() {
    if (document.getElementById("betterTrianguletQuickCSSPanel")) return;
    const mainContainer = document.querySelector(".styles__mainContainer___4TLvi-camelCase");
    if (!mainContainer) return;

    const panel = document.createElement("div");
    panel.id = "betterTrianguletQuickCSSPanel";
    panel.className = "styles__infoContainer___2uI-S-camelCase";
    panel.style.backgroundColor = getThemeColor();

    const headerRow = document.createElement("div");
    headerRow.className = "styles__headerRow___1tdPa-camelCase";

    const icon = document.createElement("i");
    icon.className = "fas fa-palette styles__headerIcon___1ykdN-camelCase";
    icon.setAttribute("aria-hidden", "true");

    const headerText = document.createElement("div");
    headerText.className = "styles__infoHeader___1lsZY-camelCase";
    headerText.textContent = "Quick CSS";

    headerRow.appendChild(icon);
    headerRow.appendChild(headerText);

    const textarea = document.createElement("textarea");
    textarea.id = "betterTrianguletQuickCSSTextarea";
    textarea.placeholder = "Enter your custom CSS here...";
    Object.assign(textarea.style, {
      width: "100%",
      minHeight: "120px",
      marginTop: "1vw",
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      color: "inherit",
      border: "1px solid var(--accent)",
      borderRadius: "0.3vw",
      padding: "0.5vw",
      fontFamily: "monospace",
      fontSize: "1vw",
      resize: "vertical",
    });

    textarea.value = localStorage.getItem("betterTriangulet_quickCSS") || "";
    textarea.addEventListener("input", () => {
      const css = textarea.value;
      applyQuickCSS(css);
      localStorage.setItem("betterTriangulet_quickCSS", css);
    });

    panel.appendChild(headerRow);
    panel.appendChild(textarea);
    mainContainer.appendChild(panel);

    applyQuickCSS(textarea.value);
  }

  function removeQuickCSSPanel() {
    const panel = document.getElementById("betterTrianguletQuickCSSPanel");
    if (panel) panel.remove();
    const styleTag = document.getElementById("betterTrianguletQuickCSS");
    if (styleTag) styleTag.remove();
  }

  function injectQuickJSPanel() {
    if (document.getElementById("betterTrianguletQuickJSPanel")) return;
    const mainContainer = document.querySelector(".styles__mainContainer___4TLvi-camelCase");
    if (!mainContainer) return;

    const panel = document.createElement("div");
    panel.id = "betterTrianguletQuickJSPanel";
    panel.className = "styles__infoContainer___2uI-S-camelCase";
    panel.style.backgroundColor = getThemeColor();

    const headerRow = document.createElement("div");
    headerRow.className = "styles__headerRow___1tdPa-camelCase";

    const icon = document.createElement("i");
    icon.className = "fas fa-terminal styles__headerIcon___1ykdN-camelCase";
    icon.setAttribute("aria-hidden", "true");

    const headerText = document.createElement("div");
    headerText.className = "styles__infoHeader___1lsZY-camelCase";
    headerText.textContent = "Quick JS";

    headerRow.appendChild(icon);
    headerRow.appendChild(headerText);

    const textarea = document.createElement("textarea");
    textarea.id = "betterTrianguletQuickJSTextarea";
    textarea.placeholder = "Enter your JavaScript here...";
    Object.assign(textarea.style, {
      width: "100%",
      minHeight: "120px",
      marginTop: "1vw",
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      color: "inherit",
      border: "1px solid var(--accent)",
      borderRadius: "0.3vw",
      padding: "0.5vw",
      fontFamily: "monospace",
      fontSize: "1vw",
      resize: "vertical",
    });

    textarea.value = localStorage.getItem("betterTriangulet_quickJS") || "";
    textarea.addEventListener("input", () => {
      const code = textarea.value;
      try {
        if (code.trim()) {
          // eslint-disable-next-line no-eval
          eval(code);
        }
      } catch (e) {
        console.error("Quick JS eval error:", e);
      }
      localStorage.setItem("betterTriangulet_quickJS", code);
    });

    panel.appendChild(headerRow);
    panel.appendChild(textarea);
    mainContainer.appendChild(panel);

    // Run the saved code immediately on load
    if (textarea.value.trim()) {
      try {
        // eslint-disable-next-line no-eval
        eval(textarea.value);
      } catch (e) {
        console.error("Quick JS eval error:", e);
      }
    }
  }

  function removeQuickJSPanel() {
    const panel = document.getElementById("betterTrianguletQuickJSPanel");
    if (panel) panel.remove();
  }

  function createModal() {
    const profileBody = document.querySelector(".arts__profileBody___eNPbH-camelCase");
    if (!profileBody) return;

    const modal = document.createElement("div");
    modal.id = "betterTrianguletModalOverlay";
    Object.assign(modal.style, {
      position: "absolute",
      top: profileBody.offsetTop + "px",
      left: profileBody.offsetLeft + "px",
      width: profileBody.offsetWidth + "px",
      height: profileBody.offsetHeight + "px",
      zIndex: "9999",
      backgroundColor: getThemeColor(),
      color: "inherit",
      borderRadius: "0.5vw",
      overflowY: "auto",
      padding: "2vw",
      fontFamily: "Nunito, sans-serif",
      display: "flex",
      flexDirection: "column",
      boxSizing: "border-box",
    });

    const closeBtn = document.createElement("div");
    closeBtn.textContent = "X";
    Object.assign(closeBtn.style, {
      position: "absolute",
      top: "1vw",
      right: "1.2vw",
      fontFamily: "'Titan One', sans-serif",
      fontSize: "2.5vw",
      color: "#ff4d4d",
      cursor: "pointer",
      userSelect: "none",
      zIndex: "10000",
      transition: "transform 0.15s ease-in-out",
    });
    closeBtn.onmouseenter = () => (closeBtn.style.transform = "scale(1.2)");
    closeBtn.onmouseleave = () => (closeBtn.style.transform = "scale(1)");
    closeBtn.onclick = () => modal.remove();

    const title = document.createElement("div");
    title.textContent = "Plugin Manager";
    Object.assign(title.style, {
      fontSize: "2vw",
      fontWeight: "800",
      marginBottom: "1vw",
      color: "var(--accent)",
      userSelect: "none",
    });

    const content = document.createElement("div");
    Object.assign(content.style, {
      fontSize: "1.2vw",
      flexGrow: "1",
      marginBottom: "2vw",
      whiteSpace: "pre-wrap",
    });

    const pluginOptions = [
      {
        name: "Quick CSS",
        storage: "quickCSS_enabled",
        onEnable: injectQuickCSSPanel,
        onDisable: removeQuickCSSPanel,
      },
      {
        name: "Quick JS",
        storage: "quickJS_enabled",
        onEnable: injectQuickJSPanel,
        onDisable: removeQuickJSPanel,
      },
      {
        name: "April Fools",
        storage: "aprilFools_enabled",
        onEnable: () => toggleFlip(true),
        onDisable: () => toggleFlip(false),
      },
    ];

    pluginOptions.forEach((opt) => {
      const toggle = document.createElement("label");
      toggle.textContent = opt.name;
      Object.assign(toggle.style, {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: "1vw",
        marginBottom: "1vw",
        fontWeight: "bold",
        fontSize: "1.2vw",
        cursor: "default",
        userSelect: "none",
      });

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = localStorage.getItem(opt.storage) === "true";
      checkbox.onchange = () => {
        const enabled = checkbox.checked;
        localStorage.setItem(opt.storage, enabled);
        if (enabled) opt.onEnable();
        else opt.onDisable();
        location.reload();
      };

      toggle.appendChild(checkbox);
      content.appendChild(toggle);
    });

    const resetText = document.createElement("text");
    resetText.className = "styles__link___5UR6_-camelCase";
    resetText.textContent = "Reset Data";
    resetText.style.cursor = "pointer";
    resetText.style.textDecoration = "underline";
    resetText.style.display = "block";
    resetText.onclick = () => {
      if (confirm("Clear all localStorage data?")) {
        localStorage.clear();
        location.reload();
      }
    };

    content.appendChild(resetText);

    modal.appendChild(closeBtn);
    modal.appendChild(title);
    modal.appendChild(content);
    profileBody.parentElement.appendChild(modal);
  }

function injectPanel() {
  const mainContainer = document.querySelector(".styles__mainContainer___4TLvi-camelCase");
  if (!mainContainer || document.getElementById("betterTrianguletBox")) return;

  const container = document.createElement("div");
  container.className = "styles__infoContainer___2uI-S-camelCase";
  container.id = "betterTrianguletBox";
  container.style.backgroundColor = getThemeColor();

  const headerRow = document.createElement("div");
  headerRow.className = "styles__headerRow___1tdPa-camelCase";

  const icon = document.createElement("i");
  icon.className = "fas fa-code styles__headerIcon___1ykdN-camelCase";
  icon.setAttribute("aria-hidden", "true");

  const headerText = document.createElement("div");
  headerText.className = "styles__infoHeader___1lsZY-camelCase";
  headerText.textContent = "BetterTriangulet";

  const pluginDiv = document.createElement("div");

  // Manage Plugins link
  const pluginText = document.createElement("text");
  pluginText.className = "styles__link___5UR6_-camelCase";
  pluginText.id = "managePlugins";
  pluginText.textContent = "Manage Plugins";
  pluginText.style.cursor = "pointer";
  pluginText.style.textDecoration = "underline";
  pluginText.style.display = "block";
  pluginText.onclick = () => {
    if (!document.getElementById("betterTrianguletModalOverlay")) {
      createModal();
    }
  };

  // Reset Data link - placed under Manage Plugins
  const resetText = document.createElement("text");
  resetText.className = "styles__link___5UR6_-camelCase";
  resetText.textContent = "Reset Data";
  resetText.style.cursor = "pointer";
  resetText.style.textDecoration = "underline";
  resetText.style.display = "block";
  resetText.style.marginTop = "0.5vw";
  resetText.onclick = () => {
    if (confirm("Clear all localStorage data?")) {
      localStorage.clear();
      location.reload();
    }
  };

  pluginDiv.appendChild(pluginText);
  pluginDiv.appendChild(resetText);

  headerRow.appendChild(icon);
  headerRow.appendChild(headerText);
  container.appendChild(headerRow);
  container.appendChild(pluginDiv);
  mainContainer.appendChild(container);

  if (localStorage.getItem("quickCSS_enabled") === "true") injectQuickCSSPanel();
  if (localStorage.getItem("quickJS_enabled") === "true") injectQuickJSPanel();
}


  function centerProfileBody() {
    const profileBody = document.querySelector(".arts__profileBody___eNPbH-camelCase");
    if (!profileBody) return;
    if (location.pathname === "/stats") {
      profileBody.style.left = "50%";
      profileBody.style.transform = "translateX(calc(-50% + 100px))";
    }
  }

  window.addEventListener("load", () => {
    if (localStorage.getItem("aprilFools_enabled") === "true") toggleFlip(true);
    centerProfileBody();
    injectPanel();
  });

  applyQuickCSS(localStorage.getItem("betterTriangulet_quickCSS") || "");
  if (localStorage.getItem("quickJS_enabled") === "true") {
    try {
      // eslint-disable-next-line no-eval
      eval(localStorage.getItem("betterTriangulet_quickJS") || "");
    } catch (e) {
      console.error("Quick JS eval error:", e);
    }
  }
})();

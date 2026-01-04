// ==UserScript==
// @name         Youtube Custom Font
// @version      0.1.1
// @author       Amm1rr
// @description  Applies a custom font, Vazirmatn, to all text elements on the current web page (YouTube).
// @homepage     https://github.com/Amm1rr/
// @namespace    amm1rr.youtube.custom.font
// @match        https://*.youtube.*/*
// @icon         https://cdn.jsdelivr.net/gh/Amm1rr/Userscripts@main/Youtube-Custom-Font/Icon.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501191/Youtube%20Custom%20Font.user.js
// @updateURL https://update.greasyfork.org/scripts/501191/Youtube%20Custom%20Font.meta.js
// ==/UserScript==

// Description:
// This script injects a small "bubble float button" on the top left corner of the YouTube page.
// Clicking the button applies a custom font, Vazirmatn, to all text elements on the webpage.
// You can customize the font family and element selector to your preference.

(function () {
  // Configuration object for easy customization
  const config = {
    fontFamily: "Vazirmatn",
    // selector: ".style-scope", //Youtube Class
    selector: "*",
    buttonID: "yt-custom-font",
    buttonText: "A",
    notificationDuration: 2000,
    buttonFadeDuration: 2000,
    notificationMessage: "Fonts updated: Vazirmatn font applied.",
    buttonTooltip: "Enhance readability with Vazirmatn font",
  };

  if (document.getElementById(config.buttonID)) {
    console.log(
      "Custom Font: " + config.buttonID + " button already exists.\n bye bye()"
    );
    // console.log("Custom Font: bye bye()");
    return;
  }

  // Apply custom font to selected elements
  function applyCustomFont(selector, fontFamily) {
    const style = document.createElement("style");
    style.textContent = `${selector} * {font-family: ${fontFamily} !important;}`;
    document.head.appendChild(style);
  }

  // Show notification with fade effect
  function showNotification(message, duration) {
    const notification = document.createElement("div");
    Object.assign(notification.style, {
      position: "fixed",
      bottom: "80%",
      left: "50%",
      transform: "translateX(-50%)",
      padding: "10px 20px",
      backgroundColor: "rgba(0, 123, 255, 0.8)",
      color: "yellow",
      borderRadius: "5px",
      boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
      zIndex: "10000",
      opacity: "0",
      transition: "opacity 0.5s ease",
      textAlign: "center",
    });
    notification.textContent = message;
    document.body.appendChild(notification);

    requestAnimationFrame(() => {
      notification.style.opacity = "1";
    });

    setTimeout(() => {
      notification.style.opacity = "0";
      notification.addEventListener(
        "transitionend",
        () => notification.remove(),
        { once: true }
      );
    }, duration);
  }

  // Create and add font change button
  function addFontChangeButton() {
    const button = document.createElement("button");
    button.id = config.buttonID;
    button.textContent = config.buttonText;
    button.title = config.buttonTooltip;

    const buttonStyle = {
      position: "fixed",
      top: "10px",
      left: "3px",
      zIndex: "9999",
      width: "20px",
      height: "20px",
      borderRadius: "50%",
      backgroundColor: "rgba(123, 110, 242, 0.3)",
      color: "#FFFFFF",
      border: "none",
      fontWeight: "bold",
      fontFamily: "Arial",
      cursor: "pointer",
      boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
      transition: "background-color 0.3s ease, opacity 0.3s ease",
    };
    Object.assign(button.style, buttonStyle);

    function setButtonHoverState(isHover) {
      if (!button.disabled) {
        button.style.backgroundColor = isHover
          ? "rgba(123, 110, 242, 0.8)"
          : "rgba(123, 110, 242, 0.3)";
      }
    }

    button.addEventListener("mouseenter", () => setButtonHoverState(true));
    button.addEventListener("mousemove", () => setButtonHoverState(true));
    button.addEventListener("mouseover", () => setButtonHoverState(true));
    button.addEventListener("mouseleave", () => setButtonHoverState(false));

    button.addEventListener("click", () => {
      button.disabled = true;
      button.style.cursor = "default";
      button.style.backgroundColor = "rgba(123, 110, 242, 0.3)";

      applyCustomFont(config.selector, config.fontFamily);
      showNotification(config.notificationMessage, config.notificationDuration);

      button.style.opacity = "0";
      setTimeout(() => {
        button.disabled = false;
        button.style.cursor = "pointer";
        button.style.opacity = "1";
      }, config.buttonFadeDuration);
    });

    document.body.appendChild(button);

    function handleFullscreenChange() {
      const isFullscreen = !!document.fullscreenElement;
      button.style.opacity = isFullscreen ? "0" : "1";
      button.style.pointerEvents = isFullscreen ? "none" : "auto";
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
  }

  // Initialize the font change functionality
  addFontChangeButton();
})();

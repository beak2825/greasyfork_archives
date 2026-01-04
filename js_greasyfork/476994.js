// ==UserScript==
// @name        MooMoo.io - Resolution Changer
// @author      Kooky Warrior
// @description Boost your FPS by adjusting the canvas resolution. You can tweak this setting in the desktop menu.
// @version     1
// @match       *://*.moomoo.io/*
// @namespace   https://greasyfork.org/users/999838
// @icon        https://cdn.glitch.com/82ae8945-dcc6-4276-98a9-665381b4cd2b/cursor12.png
// @run-at      document-start
// @grant       unsafeWindow
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/476994/MooMooio%20-%20Resolution%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/476994/MooMooio%20-%20Resolution%20Changer.meta.js
// ==/UserScript==

;(() => {
  unsafeWindow.changeResolution = true;

  const checkTrustedSymbol = Symbol("checkTrusted");
  Object.defineProperty(Object.prototype, "checkTrusted", {
    get() {
      return this[checkTrustedSymbol];
    },
    set() {
      delete Object.prototype.checkTrusted;
      this.checkTrusted = (e) => e;
    },
    configurable: true,
  });

  var resolutionValue = localStorage.getItem("resolutionValue");
  if (resolutionValue == null) {
    resolutionValue = 0.9;
    localStorage.setItem("resolutionValue", resolutionValue);
  }

  unsafeWindow.addEventListener("DOMContentLoaded", () => {
  const parent = document.getElementsByClassName("settingRadio")[0];
  parent.childNodes[1].textContent = " Change Resolution";
  unsafeWindow.devicePixelRatio = resolutionValue;
  document.getElementById("nativeResolution").dispatchEvent(
    new Event("change")
  );

  const container = document.createElement("div");
  container.className = "settingRadio";
  const numInput = document.createElement("input");
  numInput.type = "number";
  numInput.step = "0.1";
  numInput.min = "0.1";
  numInput.max = "3";
  numInput.value = resolutionValue;
  numInput.addEventListener("change", (event) => {
    if (event.target.value < event.target.min) {
      event.target.value = event.target.min;
    } else if (event.target.value > event.target.max) {
      event.target.value = event.target.max;
    } else if (event.target.value == null) {
      event.target.value = 0.9;
    }
    resolutionValue = unsafeWindow.devicePixelRatio = event.target.value;
    localStorage.setItem("resolutionValue", resolutionValue);
    document.getElementById("nativeResolution").dispatchEvent(
      new Event("change")
    );
  });

  numInput.style.borderRadius = "8px";
  numInput.style.backgroundColor = "#333";
  numInput.style.color = "#e5e3e4";

  container.appendChild(numInput);
  parent.parentNode.insertBefore(container, parent.nextSibling);
});
})();
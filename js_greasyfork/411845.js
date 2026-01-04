// ==UserScript==
// @name        canvas_checkboxes
// @namespace   Violentmonkey Scripts
// @match       http*://*.instructure.com/*/*/modules
// @match       http*://*.instructure.com/*/*/assignments
// @match       http*://*.canvas.*.edu/*/*/modules
// @match       http*://*.canvas.*.edu/*/*/assignments
// @run-at      document-end
// @grant       none
// @version     1.3
// @author      -
// @description Add checkboxes to some items in canvas to keep track of what you have read/completed.
// @downloadURL https://update.greasyfork.org/scripts/411845/canvas_checkboxes.user.js
// @updateURL https://update.greasyfork.org/scripts/411845/canvas_checkboxes.meta.js
// ==/UserScript==

const ON_COLOR = "#c4ffc4";
const OFF_COLOR = "#ffc4c4";

function toggleOn(element) {
  localStorage["ccb_" + element.querySelector(".ig-title").href] = "checked";
  element.style.background = ON_COLOR;
}

function toggleOff(element) {
  localStorage.removeItem("ccb_" + element.querySelector(".ig-title").href);
  element.style.background = OFF_COLOR;
}

function isChecked(element) {
  return Boolean(element?.querySelector("input")?.checked);
}

function initIsChecked(element) {
  return typeof localStorage[
    "ccb_" + element.querySelector(".ig-title").href
  ] === "undefined"
    ? false
    : true;
}

function colorChangerEvent() {
  isChecked(this) ? toggleOn(this) : toggleOff(this);
}

function initCheckboxes(baseElement = document) {
  [...baseElement.querySelectorAll(".ig-list")]
    .filter((element) => element.querySelector(".ig-list") == null)
    .forEach((ul) => {
      ul.querySelectorAll(".ig-row").forEach((div) => {
        let title = div.querySelector(".ig-title");
        if (!title || !(div.querySelector("input") == null)) {
          return;
        }
        let checked =
          localStorage["ccb_" + div.querySelector(".ig-title").href] ===
          "checked"
            ? "checked"
            : "";
        initIsChecked(div)
          ? (div.style.background = ON_COLOR)
          : (div.style.background = OFF_COLOR);
        title.insertAdjacentHTML(
          "afterend",
          `<input type="checkbox" style="height:20px !important;width:20px !important;" ${checked}>`
        );
        div.addEventListener("click", colorChangerEvent, false);
      });
    });
}

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node instanceof HTMLElement) {
        initCheckboxes(node);
      }
    });
  });
});

observer.observe(document.querySelector("#content"), {
  childList: true,
  subtree: true,
});

if (document.readyState === "complete") {
  initCheckboxes();
} else if (document.readyState === "interactive") {
  // DOM ready! Images, frames, and other subresources are still downloading.
  initCheckboxes();
} else {
  // Loading still in progress.
  // To wait for it to complete, add "DOMContentLoaded" or "load" listeners.

  window.addEventListener("DOMContentLoaded", () => {
    // DOM ready! Images, frames, and other subresources are still downloading.
    initCheckboxes();
  });
}

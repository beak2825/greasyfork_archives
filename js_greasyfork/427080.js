// ==UserScript==
// @name         Darken Website
// @namespace    https://theusaf.org
// @version      1.0.2
// @description  Darkens web pages without changing the funcionality of a page. Improve night reading.
// @author       theusaf
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @match        *://*/*
// @license      MIT
// @grant        none
// @noframes
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/427080/Darken%20Website.user.js
// @updateURL https://update.greasyfork.org/scripts/427080/Darken%20Website.meta.js
// ==/UserScript==

if (window.parent === window) {
  const template = document.createElement("template");
  template.innerHTML = `<div class="darken-website-usaf" style="
    position: fixed;
    top: 0;
    z-index: 99999;
    width: 100%;
    height: 100%;
    pointer-events: none;
    background: black;
    opacity: 0;
    left: 0;
  "></div>`;
  const specialElements = new Set();
  document.body.append(template.content.cloneNode(true));
  if (sessionStorage.enableDark === "true") {
    sessionStorage.enableDark = false;
    toggleDark();
  }
  window.addEventListener("fullscreenchange", (e) => {
    const { target } = e,
      darkenApplies = !!target.querySelector(".darken-website-usaf");
    if (!darkenApplies) {
      if (document.fullscreenElement) {
        // Entering full screen
        if (target.tagName === "IFRAME" || target.tagName === "VIDEO") {
          target.style.opacity = sessionStorage.enableDark == "true"
            ? 1 - (+localStorage.darkVal || 0.7)
            : 1;
          specialElements.add(target);
        } else {
          target.append(template.content.cloneNode(true));
          toggleDark();
          toggleDark();
        }
      } else {
        // Exiting full screen
        if (target.tagName === "IFRAME" || target.tagName === "VIDEO") {
          target.style.opacity = "";
          specialElements.delete(target);
        } else {
          target.querySelector(".darken-website-usaf")?.remove();
        }
      }
    }
  });
  window.addEventListener("keydown", (e) => {
    if (e.altKey && e.ctrlKey) {
      switch (e.code) {
          case "KeyC": {
              changeDark();
              e.preventDefault();
              e.stopImmediatePropagation();
              break;
          }
        case "KeyD": {
          toggleDark();
          e.preventDefault();
          e.stopImmediatePropagation();
          break;
        }
      }
    }
  });
  function changeDark() {
    const n = +prompt("Enter darkness value", localStorage.darkVal || 0.7);
    if (!isNaN(n)) {
      localStorage.darkVal = n || 0.7;
    }
    toggleDark();
    toggleDark();
    return true;
  }
  function toggleDark() {
    let darks = document.querySelectorAll(".darken-website-usaf");
    if (darks.length === 0) {
      document.body.append(template.content.cloneNode(true));
      darks = document.querySelectorAll(".darken-website-usaf");
    }
    for (let i = 0; i < darks.length; i++) {
      // Toggle darkness
      darks[i].style.opacity = sessionStorage.enableDark == "true"
        ? 0
        : +localStorage.darkVal || 0.7;
    }
    sessionStorage.enableDark =
      sessionStorage.enableDark == "true" ? false : true;
    return true;
  }
} else {
  console.log("[DARKEN] - Ignoring frame");
}

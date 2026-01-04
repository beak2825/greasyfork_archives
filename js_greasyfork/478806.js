// ==UserScript==
// @name         Discord Sidebar Toggle
// @namespace    Violentmonkey Scripts
// @match        https://discord.com/*
// @grant        none
// @version      1.1
// @author       Shaun Mitchell <shaun@shitchell.com>
// @description  7/17/2023, 9:38:40 AM
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/478806/Discord%20Sidebar%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/478806/Discord%20Sidebar%20Toggle.meta.js
// ==/UserScript==

var DEBUG = true;
var SIDEBARS_VISIBILITY_OPTION = 0;
const SIDEBARS_VISIBILITY_OPTIONS = ["auto", "hidden", "visible"];
const sidebarSelectors = [
  '#app-mount nav[aria-label="Servers sidebar"]',
  '#app-mount div[class^="sidebar"]'
];
const triggerWidth = 1130;

function debug(...args) {
  if (DEBUG) {
    const timestamp = new Date().toISOString();
    console.debug(`%c[discord.hidenavs | ${timestamp}]`, "color: green; font-weight: bold;", ...args);
  }
}

function shiftSidebarVisibility() {
  SIDEBARS_VISIBILITY_OPTION += 1;
  SIDEBARS_VISIBILITY_OPTION %= SIDEBARS_VISIBILITY_OPTIONS.length;
  let sidebarVisibilityOption = SIDEBARS_VISIBILITY_OPTIONS[SIDEBARS_VISIBILITY_OPTION];
  const sidebars = document.querySelectorAll(sidebarSelectors.join(", "));
  const sidebarToggleIconSVG = document.getElementById("toggle-sidebars-svg");

  if (sidebarVisibilityOption === "auto") {
    // Remove all classes from the sidebars
    sidebars.forEach((el) => {
      el.classList.remove("hidden");
      el.classList.remove("visible");
    });
    sidebarToggleIconSVG.style.stroke = "currentColor";
  } else if (sidebarVisibilityOption === "hidden") {
    hideElements(...sidebars);
    sidebarToggleIconSVG.style.stroke = "var(--channel-icon)";
  } else if (sidebarVisibilityOption === "visible") {
    showElements(...sidebars);
    sidebarToggleIconSVG.style.stroke = "#FFFFFF";
  }
}

function hideElements(...els) {
  els.forEach((el) => {
    el.classList.add("hidden");
    el.classList.remove("visible");
  });
}

function showElements(...els) {
  els.forEach((el) => {
    el.classList.remove("hidden");
    el.classList.add("visible");
  });
}

function toggleElementVisibility(...els) {
  els.forEach((el) => {
    let removeClass = "hidden";
    let addClass = "visible";

    if (
      (! (el.classList.contains("hidden") || el.classList.contains("visible")))
      || (el.classList.contains("hidden") && el.classList.contains("visible"))
    ) {
      // If the element contains neither of the "hidden" and "visible" classes,
      // or if it contains both classes, figure out which to use based on its width
      let width = el.getBoundingClientRect().width;
      if (width == 0) {
        // It's hidden, so show it
        showElements(el);
      } else {
        hideElements(el);
      }
    } else if (el.classList.contains("visible")) {
      hideElements(el);
    } else {
      showElements(el);
    }
  });
}

// Add CSS to the page to hide the side bars when the width is <=${triggerWidth}px
const style = document.createElement('style');
style.innerHTML = `
  ${sidebarSelectors.join(", ")} {
    transition: width 500ms ease-in-out;
  }

  .hidden {
    width: 0 !important;
  }

  @media (max-width: ${triggerWidth}px) {
      ${sidebarSelectors.map((el) => `${el}:not(.visible)`).join(", ")} {
        width: 0;
      }
  }
`;
document.head.appendChild(style);

/**
 * Toggle Menu Icon
**/

// Taken from Yong Wang @ StackOverflow:
// https://stackoverflow.com/a/61511955
function waitForElement(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

// Insert the toggle sidebars menu icon into the toolbar
function insertToggleMenuToolbarIcon() {
  // Get the toolbar element
  let toolbar = document.querySelector('section[aria-label="Channel header"] > div > div[class^="toolbar"]');
  debug("got toolbar", toolbar);

  // Create the div wrapper for the SVG
  const iconWrapperSample = toolbar.querySelector('div[class^="iconWrapper"]');
  const sidebarToggleIconWrapper = iconWrapperSample.cloneNode(false);
  sidebarToggleIconWrapper.setAttribute("aria-label", "Toggle sidebars");
  sidebarToggleIconWrapper.setAttribute("id", "toggle-sidebars-wrapper");
  debug("got iconWrapperSample", iconWrapperSample);

  // Create the base SVG element
  const svgSample = iconWrapperSample.querySelector("svg");
  const sidebarToggleIconSVG = svgSample.cloneNode(false);
  sidebarToggleIconSVG.setAttribute("style", `
    stroke: currentColor;
    stroke-linecap: round;
    stroke-width: 2.4px;
  `);
  sidebarToggleIconSVG.setAttribute("id", "toggle-sidebars-svg");
  debug("got svgSample", svgSample);

  // Create its lines
  const pathSample = svgSample.querySelector("path");
  for (i = 0; i < 3; i++) {
    const path = pathSample.cloneNode(false);
    path.setAttribute("d", `M 4.8 ${6 + (6 * i)} L ${19.2 - (3.6 * i)} ${6 + (6 * i)}"`);
    sidebarToggleIconSVG.appendChild(path);
  }

  // Add the SVG to the wrapper
  sidebarToggleIconWrapper.appendChild(sidebarToggleIconSVG);

  // Add the toggle event listener to the wrapper
  sidebarToggleIconWrapper.addEventListener("click", shiftSidebarVisibility);

  toolbar.prepend(sidebarToggleIconWrapper);
  debug("added", sidebarToggleIconWrapper, "to", toolbar);

  // If the icon wrapper gets removed, re-add it
  const observer = new MutationObserver((mutations, observer) => {
    // Fetch the toolbar again and check if it contains the wrapper
    toolbar = document.querySelector('section[aria-label="Channel header"] > div > div[class^="toolbar"]');
    let sidebarToggleIconWrapperValidation = toolbar.querySelector("#toggle-sidebars-wrapper");

    if (! sidebarToggleIconWrapperValidation) {
      toolbar.prepend(sidebarToggleIconWrapper);
      debug("re-added", sidebarToggleIconWrapper, "to", toolbar);
    }
  });
  debug("set up toolbar mutation observer", observer, "on", toolbar.parentNode.parentNode.parentNode);
  observer.observe(toolbar.parentNode.parentNode.parentNode, {
    childList: true,
    subtree: true
  });
}

// Wait for the DOM and toolbar to load, then insert the toggle sidebar icon
document.addEventListener("DOMContentLoaded", function(event) {
  debug("DOM loaded, waiting for toolbar to load");

  waitForElement('section[aria-label="Channel header"] > div > div[class^="toolbar"]').then((el) => {
    debug("toolbar loaded, inserting toggle sidebar icon")
    insertToggleMenuToolbarIcon();
  })
});

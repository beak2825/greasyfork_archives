// ==UserScript==
// @name         Link & Form Field Navigation Shortcuts
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @license      AGPL v3
// @description  Adds keyboard shortcuts for focusing: previous form field (ALT+1), next form field (ALT+2), previous link (ALT+3), and next link (ALT+4).
// @author       jcunews
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38974/Link%20%20Form%20Field%20Navigation%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/38974/Link%20%20Form%20Field%20Navigation%20Shortcuts.meta.js
// ==/UserScript==

function isElementFocusable(ele, css) {
  while (ele && (ele !== document)) {
    if (!ele.offsetWidth || !ele.offsetHeight || ((css = getComputedStyle(ele)) && (css.display === "none"))) return false;
    ele = ele.parentNode;
  }
  return true;
}

addEventListener("keypress", function(ev, eles, i) {
  if ((["1", "2"].indexOf(ev.key) >= 0) && !ev.location && ev.altKey && !ev.ctrlKey) {
    eles = Array.prototype.slice.call(document.querySelectorAll("input, select, textarea"));
    if (document.activeElement && (["INPUT", "SELECT", "TEXTAREA"].indexOf(document.activeElement.tagName) >= 0)) {
      eles.some(function(ele, i) {
        if (ele === document.activeElement) {
          ele = ev.key === "1" ? eles[i - 1] || eles[eles.length - 1] : eles[i + 1] || eles[0];
          while (ele) {
            if (isElementFocusable(ele)) {
              ele.focus();
              ele.scrollIntoView(false);
              return true;
            }
            i += ev.key === "1" ? -1 : 1;
            ele = eles[i];
          }
        }
      });
    } else if (ele = eles[ev.key === "1" ? eles.length - 1 : 0]) {
      ele.scrollIntoView();
      ele.focus();
    }
  } else if ((["3", "4"].indexOf(ev.key) >= 0) && !ev.location && ev.altKey && !ev.ctrlKey) {
    eles = Array.prototype.slice.call(document.querySelectorAll("a"));
    if (document.activeElement && (document.activeElement.tagName === "A")) {
      eles.some(function(ele, i) {
        if (ele === document.activeElement) {
          ele = ev.key === "3" ? eles[i - 1] || eles[eles.length - 1] : eles[i + 1] || eles[0];
          while (ele) {
            if (ele.href && isElementFocusable(ele)) {
              ele.focus();
              ele.scrollIntoView(false);
              return true;
            }
            i += ev.key === "1" ? -1 : 1;
            ele = eles[i];
          }
        }
      });
    } else if (ele = eles[ev.key === "3" ? eles.length - 1 : 0]) {
      ele.scrollIntoView();
      ele.focus();
    }
  }
});

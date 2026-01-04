// ==UserScript==
// @name Kinja Deals Keyboard Navigation
// @namespace https://github.com/bricemciver/GreasemonekeyScripts
// @description Use 'j' and 'k' keys for navigation of post content
// @license MIT
// @version 0.0.8
// @match *://*.theinventory.com/*
// @icon https://www.google.com/s2/favicons?sz=64&domain=theinventory.com
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/468326/Kinja%20Deals%20Keyboard%20Navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/468326/Kinja%20Deals%20Keyboard%20Navigation.meta.js
// ==/UserScript==



/* jshint esversion: 6 */
"use strict";
(() => {
  // src/main/kinja-deals-keyboard-navigation/kinja-deals-keyboard-navigation.user.ts
  (() => {
    const headTags = [];
    let pos = -1;
    const addGlobalStyle = (css) => {
      const head = document.getElementsByTagName("head")[0];
      const style = document.createElement("style");
      style.innerHTML = css;
      head.appendChild(style);
    };
    const keyPressed = (event) => {
      if (event.code === "KeyK" || event.code === "KeyJ") {
        if (headTags[pos]) {
          headTags[pos].className = headTags[pos].className.replace(" selected", "");
        }
        if ("KeyK" === event.code) {
          pos--;
        }
        if ("KeyJ" === event.code) {
          pos++;
        }
        if (pos >= headTags.length) {
          pos = 0;
        }
        if (pos < 0) {
          pos = headTags.length - 1;
        }
        headTags[pos].className = headTags[pos].className + " selected";
        headTags[pos].scrollIntoView();
      }
    };
    const removeCruft = () => {
      document.querySelectorAll(".js_movable_ad_slot").forEach((element) => element.remove());
      document.querySelectorAll(".connatix-container").forEach((element) => element.remove());
      Array.from(document.getElementsByTagName("span")).filter((item) => item.textContent === "G/O Media may get a commission").forEach((element) => {
        var _a;
        return (_a = element.closest("aside")) == null ? void 0 : _a.remove();
      });
      document.querySelectorAll("#sidebar_wrapper").forEach((element) => {
        var _a;
        return (_a = element.closest("aside")) == null ? void 0 : _a.remove();
      });
    };
    const createEntries = (containerDiv) => {
      let newElement = null;
      Array.from(containerDiv.children).forEach((element) => {
        var _a;
        if (element.tagName === "H2" && ((_a = element.textContent) == null ? void 0 : _a.length) && element.textContent.length > 0) {
          newElement = document.createElement("div");
          newElement.className = "inlineFrame";
          element.insertAdjacentElement("beforebegin", newElement);
          newElement.append(element);
        } else if (newElement) {
          newElement.append(element);
        }
      });
    };
    const addListeners = (containerDiv) => {
      headTags.push(containerDiv);
      headTags.push(...Array.from(containerDiv.querySelectorAll("div.inlineFrame, h3, h4")));
      document.addEventListener("keydown", keyPressed);
    };
    removeCruft();
    const mainDiv = document.querySelector(".js_post-content .js_commerce-inset-grid");
    if (mainDiv) {
      addGlobalStyle(
        "div.inlineFrame { margin-top:17px; margin-bottom:17px; padding:33px; border-radius:3px; border: 1px solid rgba(0,0,0,0.05) }"
      );
      addGlobalStyle("div.inlineFrame.selected { border: 1px solid rgba(0, 0, 0, 0.15) }");
      addGlobalStyle("main { width:100% !important }");
      if (mainDiv.parentElement) {
        createEntries(mainDiv.parentElement);
        addListeners(mainDiv.parentElement);
      }
    }
  })();
})();
//# sourceMappingURL=kinja-deals-keyboard-navigation.user.js.map

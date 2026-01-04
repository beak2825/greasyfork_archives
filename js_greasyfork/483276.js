// ==UserScript==
// @name         Better Transmission TabsContainer
// @namespace    npm/vite-plugin-monkey
// @version      0.0.4
// @author       Fabio Tea <iam@f4b.io> (iam.f4b.io)
// @description  A userscript to make Transmission-Web's TabsContainer better
// @license      MIT
// @icon         https://cdn.imgchest.com/files/j7kzcn6kwk7.png
// @match        *://*/transmission/web/
// @require      https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483276/Better%20Transmission%20TabsContainer.user.js
// @updateURL https://update.greasyfork.org/scripts/483276/Better%20Transmission%20TabsContainer.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /*! @violentmonkey/dom@2.1.7 | ISC License */
  var _VM;
  Object.assign(typeof VM !== "undefined" && ((_VM = VM) == null ? void 0 : _VM.versions) || {}, {
    dom: "2.1.7"
  });
  function observe(node, callback, options) {
    const observer = new MutationObserver((mutations, ob) => {
      const result = callback(mutations, ob);
      if (result)
        disconnect();
    });
    observer.observe(node, Object.assign({
      childList: true,
      subtree: true
    }, options));
    const disconnect = () => observer.disconnect();
    return disconnect;
  }
  observe(document.body, () => {
    const toolbarInspectorButton = document.querySelector("#toolbar-inspector");
    if (toolbarInspectorButton) {
      toolbarInspectorButton.addEventListener("click", () => {
        const tabsContainer = document.querySelector(".tabs-container");
        if (tabsContainer) {
          tabsContainer.style.resize = "horizontal";
          tabsContainer.style.overflow = "auto";
          tabsContainer.style.width = "900px";
        }
      });
    }
  });

})();
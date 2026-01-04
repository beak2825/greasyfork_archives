// ==UserScript==
// @name         yunser-geogebra
// @namespace    yunser
// @version      1.1.0
// @description  给 GeoGebra 网页编辑器加上撤回快捷键（Ctrl + Z）。
// @license      MIT
// @include      https://www.geogebra.org/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/444741/yunser-geogebra.user.js
// @updateURL https://update.greasyfork.org/scripts/444741/yunser-geogebra.meta.js
// ==/UserScript==

;(({ cssTextList = [] }) => {
  cssTextList.forEach((s) => {
    const style = document.createElement("style");
    style.innerText = s;
    style.dataset.source = "vite-plugin-monkey";
    document.head.appendChild(style);
  });
})({
  "cssTextList": []
});

(function() {
  "use strict";
  window.addEventListener("keydown", (e) => {
    if (e.code == "KeyZ" && e.metaKey) {
      if (document.activeElement.nodeName != "INPUT" && document.activeElement.nodeName != "TEXTAREA") {
        unsafeWindow.ggbApplet.undo();
      }
    }
  });
})();
 

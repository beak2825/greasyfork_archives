// ==UserScript==
// @name          Eruda Loader
// @description   Load and setup Eruda with DOM plugin
// @namespace     Eruda
// @author        RainSlide
// @match         *://*/*
// @exclude-match https://eruda.liriliri.io/*
// @version       1.1
// @grant         none
// @run-at        document-idle
// @require   https://cdn.jsdelivr.net/npm/eruda
// @require   https://cdn.jsdelivr.net/npm/eruda-dom
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/407295/Eruda%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/407295/Eruda%20Loader.meta.js
// ==/UserScript==

"use strict";

const getType = _ =>
 Object.prototype.toString.call(_)
  .slice(8, -1);

const error = msg =>
 console.error("[Eruda Loader] " + msg);

const loadError = (name, type) => {
 error(name + " is not an " + type);
 return false;
}

const isErudaLoaded =
 getType(window.eruda) !== "Object"
 ? loadError("window.eruda", "Object")
 : getType(eruda._isInit) !== "Boolean"
 ? loadError("eruda._isInit", "Boolean")
 : true;

if (
 isErudaLoaded &&
 eruda._isInit === false
) {

eruda.init();

/*
eruda.init({
// container: containerElement,
// tool: [ "toolName1", "toolName2" ],
// useShadowDom: true,
// autoScale: true,
// defaults: {
//  transparency: 1,
//  displaySize: 80,
//  theme: "themeName"
// }
});
*/

eruda.get("console").config.set(
 "maxLogNum", 256
);

eruda.add(erudaDom);

(() => {

eruda._shadowRoot.appendChild(
 document.createElement("style")
).textContent = `
/* use monospace font */
#eruda-console .eruda-logs-container,
#eruda-elements .eruda-parents,
#eruda-elements .eruda-breadcrumb,
#eruda-elements .eruda-children,
#eruda-elements .eruda-table-wrapper,
#eruda-elements .eruda-style-rules,
#eruda-resources table,
#eruda-sources .eruda-code-wrapper,
#eruda-sources .eruda-raw-wrapper {
 font-family: monospace;
}

/* Circlize the entry button */
.eruda-container .eruda-entry-btn {
 border-radius: 50%;
}
/* Centerize its icon */
.eruda-icon-tool {
 font-size: 28px;
}
.eruda-icon-tool::before {
 vertical-align: middle;
}

`.trim();

})();

}

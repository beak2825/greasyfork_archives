// ==UserScript==
// @name         Yapi2Typescript
// @namespace    https://github.com/codeshareman/tookit.git
// @version      0.11
// @description  yapi接口定义转typescript
// @author       codeshareman
// @match        *://*/*
// @run-at       document-start
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/443856/Yapi2Typescript.user.js
// @updateURL https://update.greasyfork.org/scripts/443856/Yapi2Typescript.meta.js
// ==/UserScript==

(function () {
  "use strict";
  window.onload = () => {
    const ORIGIN = location.origin || "http://172.18.192.19:8989";
    const API_INTERFACE_ADDRESS = `${ORIGIN}/api/interface/get`;
    console.log("%c⧭", "color: #ff0000", 222);
  };
})();

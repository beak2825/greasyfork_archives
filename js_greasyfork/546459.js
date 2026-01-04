// ==UserScript==
// @name         Always Editable
// @namespace    yournamespace
// @version      1.0
// @description  Automatically makes all pages editable
// @author       you
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546459/Always%20Editable.user.js
// @updateURL https://update.greasyfork.org/scripts/546459/Always%20Editable.meta.js
// ==/UserScript==

(function () {
  "use strict";
  document.body.contentEditable = "true";
  document.designMode = "on";
})();

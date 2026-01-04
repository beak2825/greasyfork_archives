// ==UserScript==
// @name         Quora Bypass Signup
// @namespace    http://ashish.link/
// @version      2.2
// @description  Access all of Quora without ever signing up!
// @author       Ashish Ranjan
// @match        https://www.quora.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/406530/Quora%20Bypass%20Signup.user.js
// @updateURL https://update.greasyfork.org/scripts/406530/Quora%20Bypass%20Signup.meta.js
// ==/UserScript==

(function() {
  "use strict";
  window.addEventListener('load', function () {
    var _document$getElementB, _document$getElementB2, _document$getElementB3, _document$getElementB4;
    const container = (_document$getElementB = document.getElementById('root')) === null || _document$getElementB === void 0 ? void 0 : (_document$getElementB2 = _document$getElementB.children) === null || _document$getElementB2 === void 0 ? void 0 : (_document$getElementB3 = _document$getElementB2[0]) === null || _document$getElementB3 === void 0 ? void 0 : (_document$getElementB4 = _document$getElementB3.children) === null || _document$getElementB4 === void 0 ? void 0 : _document$getElementB4[0];
    if ((container === null || container === void 0 ? void 0 : container.childElementCount) < 3) {
      var _container$children$;
      (_container$children$ = container.children[0]) === null || _container$children$ === void 0 ? void 0 : _container$children$.remove();
      (container.children[0] || {}).style = '';
    }
  }, false);
})()

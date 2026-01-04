// ==UserScript==
// @name         Wide LIHKG
// @namespace    https://github.com/quantumsnowball/wide-lihkg-userscript
// @description  Change all LIHKG.com pages to be full width and dynamically sized.
// @version      1.0.0
// @author       Quantum Snowball
// @match        https://github.com/quantumsnowball/wide-lihkg-userscript
// @icon         https://www.google.com/s2/favicons?domain=lihkg.com
// @homepageURL  https://github.com/quantumsnowball/wide-lihkg-userscript
// @supportURL   https://github.com/quantumsnowball/wide-lihkg-userscript/issues
// @license      MIT; https://github.com/quantumsnowball/wide-lihkg-userscript/blob/master/LICENSE
// @grant        none
// @include      *lihkg.com*
// @downloadURL https://update.greasyfork.org/scripts/430707/Wide%20LIHKG.user.js
// @updateURL https://update.greasyfork.org/scripts/430707/Wide%20LIHKG.meta.js
// ==/UserScript==


var styleSheet = "" +
  "body[data-app-cx] #app {" +
  "max-width: 100%;" +
  "}" +
  "";

(function () {
  var s = document.createElement('style');
  s.type = "text/css";
  s.innerHTML = styleSheet;
  (document.head || document.documentElement).appendChild(s);
})();

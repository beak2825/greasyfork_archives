// ==UserScript==
// @name        GitHub - open closed issues if there are no open issues
// @namespace   https://github.com/AbdurazaaqMohammed
// @author       Abdurazaaq Mohammed
// @version     1.0
// @description Automatically opens closed issues if there are no open issues on GitHub.
// @match       https://github.com/*/issues
// @grant       none
// @run-at      document-start
// @homepage    https://github.com/AbdurazaaqMohammed/userscripts
// @supportURL  https://github.com/AbdurazaaqMohammed/userscripts/issues
// @license     The Unlicense
// @downloadURL https://update.greasyfork.org/scripts/490028/GitHub%20-%20open%20closed%20issues%20if%20there%20are%20no%20open%20issues.user.js
// @updateURL https://update.greasyfork.org/scripts/490028/GitHub%20-%20open%20closed%20issues%20if%20there%20are%20no%20open%20issues.meta.js
// ==/UserScript==

(function() {
  'use strict';

  if(document.querySelector('.selected.btn-link').textContent.trim().startsWith(0)) document.querySelector("#js-issues-toolbar > div > div.flex-auto.d-none.d-lg-block.no-wrap > div > a:nth-child(2)").click();
})();

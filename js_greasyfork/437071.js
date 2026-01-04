// ==UserScript==
// @name         GravityApprover
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Batch ignore seer ticket
// @author       LittleDuckLiu
// @match        https://bpm.sankuai.com/taskform/*/show?*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437071/GravityApprover.user.js
// @updateURL https://update.greasyfork.org/scripts/437071/GravityApprover.meta.js
// ==/UserScript==

(function() {
  setTimeout(function() {
    Array.from(document.getElementsByClassName('radio')).find(it => it.innerText === '通过').getElementsByTagName('input')[0].click();
    document.getElementsByClassName('submit-btn')[0].click();
  }, 1500);
})();
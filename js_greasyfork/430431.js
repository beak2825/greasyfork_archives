// ==UserScript==
// @name        Clear UI
// @author      Altanis
// @namespace   Press R to Disable UI when spectating someone
// @description Press R to Disable UI when spectating someone
// @version     1.0.0
// @match       *://diep.io/
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/430431/Clear%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/430431/Clear%20UI.meta.js
// ==/UserScript==

(function() {
    var toggle = true;

    document.addEventListener('keydown', function({ code }) {
        console.log(code);
       if (code === 'KeyR') {
          toggle = !toggle;
          input.execute(`ren_ui ${toggle}`);
       }
    });
})();
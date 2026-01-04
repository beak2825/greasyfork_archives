// ==UserScript==
// @name         Auto-WrapUp
// @version      0.1
// @author       zdennis
// @match        https://www.wanikani.com/review/session
// @description  Automatic Wrapup
// @grant        none
// @namespace https://greasyfork.org/users/144039
// @downloadURL https://update.greasyfork.org/scripts/31784/Auto-WrapUp.user.js
// @updateURL https://update.greasyfork.org/scripts/31784/Auto-WrapUp.meta.js
// ==/UserScript==

window.autoLoadWrapUp = function() {
    if (jQuery("#option-wrap-up").length === 0) {
        setTimeout(function() {
            window.autoLoadWrapUp();
        }, 200);
    } else {
        jQuery("#option-wrap-up").not(".wrap-up-selected").click();
    }
};
window.autoLoadWrapUp();
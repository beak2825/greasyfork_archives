// ==UserScript==
// @name          Wanikani Reorder Ultimate 2
// @namespace     https://www.wanikani.com
// @description   Learn in the order you want to.
// @version       2.2.8.1
// @match         https://www.wanikani.com/lesson/session
// @match         https://www.wanikani.com/review/session
// @match         https://preview.wanikani.com/lesson/session
// @match         https://preview.wanikani.com/review/session
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/19088/Wanikani%20Reorder%20Ultimate%202.user.js
// @updateURL https://update.greasyfork.org/scripts/19088/Wanikani%20Reorder%20Ultimate%202.meta.js
// ==/UserScript==

window.reorder = {};

(function(gobj) {

    //===================================================================
    // Initialization of the Wanikani Open Framework.
    //-------------------------------------------------------------------
    if (confirm('Your installed version of Reorder Ultimate 2 no longer works.  Do you want to update?')) {
        window.location.href = 'https://community.wanikani.com/t/userscript-reorder-ultimate-2-newest/35152';
    }
    return;


})(window.reorder);
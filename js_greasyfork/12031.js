// ==UserScript==
// @name         WK Alternate F
// @version      0.1
// @description  Negates the effect of your F'd up F key by allowing the V key to duplicate its functionality.
// @author       Me
// @match        https://www.wanikani.com/lesson/session
// @match        https://www.wanikani.com/review/session
// @grant        none
// @namespace https://greasyfork.org/users/8907
// @downloadURL https://update.greasyfork.org/scripts/12031/WK%20Alternate%20F.user.js
// @updateURL https://update.greasyfork.org/scripts/12031/WK%20Alternate%20F.meta.js
// ==/UserScript==

$(document).on("keyup", function(e) {
    if (e.keyCode === 86) { // v
        $("li#option-item-info").click();
    }
});
// ==UserScript==
// @name         UI - Auto Edit
// @description Automatically redirects record to edit mode
// @version      0.1
// @match        https://owaisashfaq.quickbase.com/db/bixmzbcjn?a=q&qid=-*
// @grant        none
// @namespace https://greasyfork.org/users/228706
// @downloadURL https://update.greasyfork.org/scripts/374862/UI%20-%20Auto%20Edit.user.js
// @updateURL https://update.greasyfork.org/scripts/374862/UI%20-%20Auto%20Edit.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(()=>{
                   document.getElementById("EditRecordButton").click();
        }
    ,1000)
    // Set Header
    $(".FirstItem").append("<p class='recvHeader'>SCRIPT RUNNING</p>").css("color", "orange")
    $(".FirstItem").css("padding-top", "5px")
})();
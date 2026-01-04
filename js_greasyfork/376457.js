// ==UserScript==
// @name         BL R9.75 Message Spam Script
// @namespace    Bootleggers R9.75
// @version      0.0.4
// @description  Spam messages to a specified target to increase message count on your profile
// @author       BD
// @match        https://www.bootleggers.us/send.php
// @update       https://greasyfork.org/scripts/376457-bl-r9-75-message-spam-script/code/BL%20R975%20Message%20Spam%20Script.user.js
// @downloadURL https://update.greasyfork.org/scripts/376457/BL%20R975%20Message%20Spam%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/376457/BL%20R975%20Message%20Spam%20Script.meta.js
// ==/UserScript==

$(document).ready(function() {
    var target = "";
    var pauseScript = true;
    target == "" ? alert("Please set targets name in the Message Spam script source.") : pauseScript = false;
    if (!pauseScript) {
        document.querySelectorAll("[name='sendTo']")[0].value = target;
        $("textarea")[0].value = "Hi";
        setTimeout(function() {
            document.querySelectorAll("[value='Send!']")[0].click();
        }, 500);
    }
});
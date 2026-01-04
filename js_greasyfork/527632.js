// ==UserScript==
// @name         MSMdownloader
// @version      1.0.0
// @description  MSM movie auto downloader
// @author       Rizuwan
// @match        https://go.msmbot.club/link/*
// @grant        none
// @namespace https://greasyfork.org/users/40022
// @downloadURL https://update.greasyfork.org/scripts/527632/MSMdownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/527632/MSMdownloader.meta.js
// ==/UserScript==

setTimeout(async function() {
    if($(".tgfileid").length) {
        $(".tgfileid").click();
        setTimeout(function() {
            window.close()
        }, 25);
    }
},5);
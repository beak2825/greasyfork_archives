// ==UserScript==
// @name         BL R9.75 PI Result Monitor
// @namespace    Bootleggers R9.75
// @version      0.0.2
// @description  Check mailbox for search results from your PI, then notify your phone.
// @author       BD
// @include      https://www.bootleggers.us/mailbox.php?piResults
// @update       https://greasyfork.org/scripts/376771-bl-r9-75-pi-result-monitor/code/BL%20R975%20PI%20Result%20Monitor.user.js
// @downloadURL https://update.greasyfork.org/scripts/376771/BL%20R975%20PI%20Result%20Monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/376771/BL%20R975%20PI%20Result%20Monitor.meta.js
// ==/UserScript==

if ($(".newmessage").length) {
    $(".newmessage").each(function() {
        if (($(this).find("tr")[0].textContent.includes("DinoPirozzi")) || ($(this).find("tr")[0].textContent.includes("NoemiEsposito")) || ($(this).find("tr")[0].textContent.includes("MarcoMancini"))) {
            $.post("https://maker.ifttt.com/trigger/searchcomplete/with/key/c-iCbQpdna3eYfDhP63OCM");
        }
    });
}
setTimeout(function() {
    window.location.href = "/mailbox.php?piResults";
}, 30000);
//
// ==UserScript==
// @name         pimeyes helper
// @namespace    https://greasyfork.org/morca
// @version      0.2
// @description  allow thumbnail operations
// @author       morca
// @match        https://pimeyes.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420544/pimeyes%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/420544/pimeyes%20helper.meta.js
// ==/UserScript==

if (typeof jQuery == "undefined" || $().jquery < "1.8.0") {
    let script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js";
    script.onload = code;
    document.getElementsByTagName("head")[0].appendChild(script);
} else {
    code();
}
function code() {
    'use strict';
    function watchAutoPager(holder, load) {
        $(holder).each((i, e) => {
            var countDefer = 0;
            var timerDefer;
            e.addEventListener('DOMNodeInserted', function(e) {
                countDefer = 0;
                if (!timerDefer) timerDefer = setInterval(() => {
                    if (countDefer < 2) {
                        countDefer++;
                        return;
                    }
                    clearInterval(timerDefer);
                    timerDefer = null;
                    if (load) load();
                }, 1000);
            });
        });
    }
    watchAutoPager(".container", () => {
        $(".info").each((i, e) => {
//            $(e).parent().find(".actions").css("width", "0%");
            //$(e).find("span").unbind('click');
//            $(e).find("button").remove();
//            $(e).removeClass("info");
        });
        $("span.url").each((i, e) => {
//            console.log(e);
            $(e).css("max-width", "fit-content");
        });
    });
}
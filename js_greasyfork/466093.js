// ==UserScript==
// @name         wows_content_unlock
// @namespace    http://tampermonkey.net/
// @version      2023.05.12.1
// @description  wows content unlock
// @author       jacky
// @license     MIT
// @match        https://worldofwarships.asia/*/content/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=worldofwarships.asia
// @run-at      document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466093/wows_content_unlock.user.js
// @updateURL https://update.greasyfork.org/scripts/466093/wows_content_unlock.meta.js
// ==/UserScript==

window.addEventListener ("load", pageFullyLoaded);

function pageFullyLoaded () {
    setTimeout(function(){
        $(".map-main .pin.disabled").each(function(){
            $(this).css("background-color", "grey");
            $(this).removeClass("disabled");
        });
    },3000);
}
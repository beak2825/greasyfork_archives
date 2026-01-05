// ==UserScript==
// @name         Facebook Image Alt Text Display
// @namespace    http://
// @version      0.1
// @description  Display automated alt text over images.
// @author       Marko Zabreznik
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @match        https://www.facebook.com/
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/22304/Facebook%20Image%20Alt%20Text%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/22304/Facebook%20Image%20Alt%20Text%20Display.meta.js
// ==/UserScript==

function debounce (func, threshold) {
    var timeout;
    var obj = this;
    function delayed () {
        func.apply(obj);
        timeout = null;
    }
    return function () {
        if (timeout)
            clearTimeout(timeout);
        timeout = setTimeout(delayed, threshold);
    };
}

function showAlt() {
    $("#contentArea img[alt]:not(.fimah).img").each(function(){
        var img = $(this);
        img.addClass('fimah');
        if (img.hasClass('UFIActorImage') || !img.attr('alt') || img.attr('alt') == "No automatic alt text available.") {
            return;
        }
        $('<div style="position:absolute;bottom: 0; padding: 4px; left: 0;background:rgba(255,255,255,0.5); color: black;"></div>')
            .text(img.attr('alt')).insertAfter(this);
    });
}

new MutationObserver(debounce(showAlt, 200)).observe(document, {subtree: true, childList: true});
// ==UserScript==
// @name         Injectable AdBlocker
// @namespace    AD BLOCK_:)
// @version      1-beta
// @description  Simple AdBlocker
// @author       CyberMafia
// @match        *://*/*
// @grant        dev
// @downloadURL https://update.greasyfork.org/scripts/422253/Injectable%20AdBlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/422253/Injectable%20AdBlocker.meta.js
// ==/UserScript==

(function removeAdvertisementAndBlockingElements () {
    $('.inRek').remove();
    $('.mgbox').remove();

    Array.from(document.getElementsByTagName("img")).forEach(function (e) {
        if (!e.src.includes(window.location.host)) {
            e.remove()
        }
    });

    Array.from(document.getElementsByTagName("div")).forEach(function (e) {
        var currentZIndex = parseInt(document.defaultView.getComputedStyle(e, null).zIndex);
        if (currentZIndex > 999) {
            console.log(parseInt(currentZIndex));
            e.remove()
        }
    });
})();
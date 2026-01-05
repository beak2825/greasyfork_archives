// ==UserScript==
// @name           Angel Learning Print/Copy Enabler
// @description:en Disables the no-printing and no-copying restrictions on grade results pages on the GVTC Angel Learning website.
// @namespace      mailto:reidrankin@gmail.com
// @include        http*://gvtc.angellearning.com/*/GradeDelivery.aspx*
// @version 0.0.1.20160209220004
// @description Disables the no-printing and no-copying restrictions on grade results pages on the GVTC Angel Learning website.
// @downloadURL https://update.greasyfork.org/scripts/16974/Angel%20Learning%20PrintCopy%20Enabler.user.js
// @updateURL https://update.greasyfork.org/scripts/16974/Angel%20Learning%20PrintCopy%20Enabler.meta.js
// ==/UserScript==

function enableStuff() {
    // Disable all inline stylesheets. There's only one on these grade results pages, the one that disables printing.
    for (var i = 0; i < document.styleSheets.length; i++) {
        if (document.styleSheets[i].href == null) document.styleSheets[i].disabled = true;
    }
    
    // Basic, general right-click-disabler disabler
    var doc = document.wrappedJSObject || document, win = window.wrappedJSObject || window;
    doc.onmouseup = null;
    doc.onmousedown = null;
    doc.oncontextmenu = null;
    doc.onselectstart = null;
}

window.addEventListener("load", enableStuff, false);
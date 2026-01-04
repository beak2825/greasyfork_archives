// ==UserScript==
// @name         PDF Background Color Controller
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  This script can change the backgroud color for the pdf files opened by your brower. It is applicable for Chrome build-in PDF viewer, pdf.js, overleaf's pdf reviewer and your local files (Please allow the Tampermonkey to access file urls in browser's setting by going to chrome://extensions/, and set Allow access to file URLs.).
// @author       Maple
// @match        *://*/*
// @icon         https://icon-icons.com/downloadimage.php?id=130274&root=2107/ICO/64/&file=file_type_pdf_icon_130274.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/437073/PDF%20Background%20Color%20Controller.user.js
// @updateURL https://update.greasyfork.org/scripts/437073/PDF%20Background%20Color%20Controller.meta.js
// ==/UserScript==

function get_cover() {
    let css = `
        position: absolute;
        pointer-events: none;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #FDF6E3;
        mix-blend-mode: multiply;
        z-index: 100000;
    `;
    var cover = document.createElement("div");
    cover.setAttribute("style", css);
    return cover;
}

function renderPage(url, panelSelector) {
    if (window.location.href.includes(url)) {
        var cover = get_cover();
        var scope = document.querySelector(panelSelector);
        //console.log(scope);
        if (scope === null) {
            setTimeout(() => renderPage(url, panelSelector), 1000); // Retry after 1 second
        } else {
            scope.appendChild(cover);
        }
    }
}

(function() {
    'use strict';

    renderPage("https://www.overleaf.com/project/", "div.ide-react-panel[data-panel-id='panel-pdf']"); // Call renderPage for possible Overleaf pages
    renderPage("https://docs.google.com/", "div.kix-scrollareadocumentplugin.docs-ui-hit-region-surface"); // Call renderPage for possible Overleaf pages

    var embed = document.querySelector("embed");
    if ((embed !== null && embed.type == "application/pdf") || (typeof pdfjsLib !== "undefined") || (window.location.href.includes(".pdf"))) {
        var cover = get_cover();
        document.body.appendChild(cover);
    }
})();

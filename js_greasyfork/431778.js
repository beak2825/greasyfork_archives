// ==UserScript==
// @name         Double-click for SyncTeX goto-pdf on Overleaf
// @namespace    http://sloan.nietert.me
// @version      0.1
// @description  Double-click to go to code location in PDF on Overleaf (works as well as the button on Overleaf, which sometimes has issues)
// @author       Sloan Nietert
// @match        https://www.overleaf.com/project/*
// @icon         https://www.google.com/s2/favicons?domain=overleaf.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431778/Double-click%20for%20SyncTeX%20goto-pdf%20on%20Overleaf.user.js
// @updateURL https://update.greasyfork.org/scripts/431778/Double-click%20for%20SyncTeX%20goto-pdf%20on%20Overleaf.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById("editor").addEventListener("dblclick", function () {
        document.getElementsByClassName('synctex-control-goto-pdf')[0].click()
    } );
})();
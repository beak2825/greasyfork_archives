// ==UserScript==
// @name         cdnfile.top
// @namespace    none
// @license      MIT
// @version      2025-05-01
// @description  open the pic directly and scale to full page
// @author       rustyx
// @match        https://cdnfile.top/myrelease/foto.php?var=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534647/cdnfiletop.user.js
// @updateURL https://update.greasyfork.org/scripts/534647/cdnfiletop.meta.js
// ==/UserScript==

(function() {
    var url = new URLSearchParams(window.location.search).get('var');
    if (url) {
        document.open();
        document.write('<body><img src="' + url.replace(/[<>:]/g,'') + '" style="min-width:100%;min-height:100%"></body>');
        document.close();
    }
})();

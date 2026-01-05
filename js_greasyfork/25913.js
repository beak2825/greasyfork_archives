// ==UserScript==
// @name         Open Image in New Tab
// @version      0.01
// @namespace    https://orbitalzero.ovh/scripts/
// @description  Open image in new tab by ctrl+rightclicking them
// @author       NeutronNoir
// @include      *
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/25913/Open%20Image%20in%20New%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/25913/Open%20Image%20in%20New%20Tab.meta.js
// ==/UserScript==

(function() {
    var images = document.getElementsByTagName('img');
    Array.from(images).forEach(function (image) {
        image.addEventListener('contextmenu', function (event) {
            if (event.ctrlKey) event.preventDefault();
        });
        image.addEventListener('mousedown', function (event) {
            if(event.button == 2 && event.ctrlKey)
            {
                event.preventDefault();
                GM_openInTab(image.src, true);
            }
        });
    });
})();
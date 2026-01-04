// ==UserScript==
// @name         YouTube - Remove Download Button
// @namespace    https://greasyfork.org/en/users/933798
// @version      0.2
// @description  This removes the Download button on the sidebar along with the button on the watch page.
// @author       Magma_Craft
// @license MIT
// @match        https://www.youtube.com/*
// @icon         https://www.youtube.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454638/YouTube%20-%20Remove%20Download%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/454638/YouTube%20-%20Remove%20Download%20Button.meta.js
// ==/UserScript==

window.setTimeout(
    function check() {
        if (document.querySelector('[title="Downloads"]')) {
            shorts();
        }
        window.setTimeout(check, 250);
    }, 250
);

function shorts() {
    var node = document.querySelector('[title="Downloads"]');
    node.style.display = "none";
}

(function() {
    'use strict';
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerText = 'ytd-menu-service-item-download-renderer{display:none;}';
    document.head.appendChild(style);
})();
(function() {
    'use strict';
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerText = 'ytd-download-button-renderer{display:none;}';
    document.head.appendChild(style);
})();
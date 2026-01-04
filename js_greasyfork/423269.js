// ==UserScript==
// @name         MTS Sidebar Fix
// @namespace    https://gist.github.com/Kadauchi
// @version      1.0.0
// @description  Fixes my bad code while we wait for the webstores to publish the update.
// @author       Kadauchi
// @include      *
// @downloadURL https://update.greasyfork.org/scripts/423269/MTS%20Sidebar%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/423269/MTS%20Sidebar%20Fix.meta.js
// ==/UserScript==

const observer = new MutationObserver((mutationList, observer)=> {
    const iframe = document.querySelector('iframe[src*="/features/sidebar/pages/sidebar.html"]');

    if (iframe) {
        iframe.src= iframe.src.replace('/features', '');
    }

});

observer.observe(document.body, { childList: true, subtree: true });
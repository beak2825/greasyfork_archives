// ==UserScript==
// @name         Tom Links New Tab
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Forces links in SharePoint to be opened in new tab
// @author       geesmavi
// @include      https://share.amazon.com/sites/TOMLinksDocs/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/442180/Tom%20Links%20New%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/442180/Tom%20Links%20New%20Tab.meta.js
// ==/UserScript==

(function() {
    const contentBoxObserver = new MutationObserver((mutations, obs) => {
        const layoutsTable = document.querySelector('#layoutsTable');
        if (layoutsTable) {
            linkOverride(layoutsTable);
            obs.disconnect();
            return;
        }
    });

    contentBoxObserver.observe(document, {
        childList: true,
        subtree: true
    });


    function linkOverride(target) {
        const anchors = target.querySelectorAll('a[href]');
        anchors.forEach(anchor => {
            anchor.setAttribute('target', '_blank');
            anchor.setAttribute('data-interception', 'off');
        });

    }
})();
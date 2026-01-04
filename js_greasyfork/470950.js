// ==UserScript==
// @name         Beehaw.org Open Posts in New Tab
// @namespace    https://greasyfork.org/en/users/1127287-harasho
// @version      0.6
// @description  Opens specific links in a new tab on beehaw.org
// @author       You
// @match        https://beehaw.org/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/470950/Beehaworg%20Open%20Posts%20in%20New%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/470950/Beehaworg%20Open%20Posts%20in%20New%20Tab.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Function to add onclick attribute to specific links
    function addTargetBlankToLinks() {
        const addOnclickToLink = (link) => {
            link.setAttribute('onclick', "window.open(this.href,'_blank');return false;");
        };

        const primaryLinks = document.querySelectorAll('a.link-primary');
        const darkLinksInH1 = document.querySelectorAll('h1 a.link-dark');
        const specificLinks = document.querySelectorAll('.btn.btn-link.btn-sm.text-muted.ps-0');
        const otherLinks = document.querySelectorAll('a.thumbnail.rounded.overflow-hidden.d-inline-block.position-relative.p-0.border-0');

        primaryLinks.forEach(addOnclickToLink);
        darkLinksInH1.forEach(addOnclickToLink);
        specificLinks.forEach(addOnclickToLink);
        otherLinks.forEach(addOnclickToLink);
    }

    // Observe DOM changes and add onclick attribute to newly added links
    const observer = new MutationObserver(() => {
        addTargetBlankToLinks();
    });

    const targetNode = document.body;
    const observerConfig = {
        childList: true,
        subtree: true,
    };

    observer.observe(targetNode, observerConfig);

    // Call the function to add onclick attribute to existing links
    addTargetBlankToLinks();
})();
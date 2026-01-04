// ==UserScript==
// @name         Better Window Titles on admin.atlassian.com
// @namespace    http://schuppentier.org/
// @version      0.1
// @description  Replaces the generic "Administration" Window title on Atlassian Admin pages to the Breadcrumb and Title of the actual page
// @author       Dennis Stengele
// @match        https://admin.atlassian.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atlassian.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463768/Better%20Window%20Titles%20on%20adminatlassiancom.user.js
// @updateURL https://update.greasyfork.org/scripts/463768/Better%20Window%20Titles%20on%20adminatlassiancom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function updateTitle() {
        const breadcrumbs = Array.from(document.querySelectorAll('nav[aria-label="Breadcrumbs"] > ol > li'));
        const breadcrumbsNames = breadcrumbs.map((node) => {return node.innerText;});
        const titleText = document.querySelector("div#root h1").innerText;
        const newTitle = breadcrumbsNames.concat([titleText]).join(" > ");
        document.title = newTitle;
    }

    const observer = new MutationObserver(updateTitle);

    observer.observe(document.body, {attributes: true, childList: true, subtree: true});
})();
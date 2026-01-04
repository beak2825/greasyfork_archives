// ==UserScript==
// @name         PR page improvements
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  many things for github PRs
// @author       Louis Yvelin
// @match        https://github.com/ebuzzing/*/pull/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499763/PR%20page%20improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/499763/PR%20page%20improvements.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //// === SET YOU USERNAME HERE
    const USERNAME = 'github-louis-yvelin' // <=== SET YOU USERNAME HERE
    //// === SET YOU USERNAME HERE

    let lastUrl = location.href;
    // Create a MutationObserver to monitor the DOM for changes
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0) {
                // Check if any of the added nodes contain the elements we are interested in


                // --------
                // -------- PR jobs no scroll, infinite height
                // --------
                // Add style to the document
                // const style = document.createElement('style');
                // style.textContent = '.MergeBoxExpandable-module__expandableContent--F8GC8 MergeBoxExpandable-module__isExpanded--Le972 { max-height: 1000dvh !important; }';
                // document.head.appendChild(style);
                Array.from(document.querySelectorAll('[class*="MergeBoxExpandable-module__isExpanded"]')).forEach(e => e?.setAttribute("style", "max-height: 100dvh;"));


                // --------
                // -------- PR jobs links target blank
                // --------
                document.querySelectorAll('a.status-actions').forEach(e => {
                    e.setAttribute('target', '_blank');
                });

                // --------
                // -------- All sonarcloud links target blank
                // --------
                [...document.querySelectorAll('a')].filter(e => e.getAttribute('href').includes("http") || e.getAttribute('href').includes("/actions/")).forEach(link => link.setAttribute('target', '_blank'));

                // --------
                // -------- For Marine highlight buttons in red in PRs that do not belong to you
                // --------
                if (document.querySelector("#partial-discussion-header div.flex-auto.min-width-0.mb-2 > a").innerText !== USERNAME) Array.from(document.querySelectorAll(".MergeBox-module__mergePartialContainer--N4i3Z .prc-ButtonGroup-ButtonGroup-vcMeG button") ).forEach((e) => e.setAttribute('style', "background-color: #f59090"));

            }
            lastUrl = location.href;
        });
    });

    // Configure the observer to watch for additions to the child list of the target node
    const config = { childList: true, subtree: true };

    // Start observing the document body for changes
    observer.observe(document.body, config);

    // --------
    // -------- Add hide whitespace by default
    // --------
    const goToFilesElement = document.querySelector("#repo-content-pjax-container > div > div.clearfix.js-issues-results > div.px-3.px-md-0.ml-n3.mr-n3.mx-md-0.tabnav > nav > a:nth-child(4)");
   goToFilesElement.setAttribute('href', goToFilesElement.getAttribute('href') + '?w=1');
})();
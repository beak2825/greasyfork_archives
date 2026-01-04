// ==UserScript==
// @name         Go to filtered files tab
// @namespace    crinfarr.io
// @version      2024-07-18_03
// @description  Jumps directly to the downloads for the version you have selected when clicking the project card.  This really should be what it does anyway
// @author       Crinfarr
// @match        https://www.curseforge.com/minecraft/search?*
// @match        https://curseforge.com/minecraft/search?*
// @match        https://www.curseforge.com/minecraft/search
// @match        https://curseforge.com/minecraft/search
// @sandbox      MAIN_WORLD
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/501041/Go%20to%20filtered%20files%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/501041/Go%20to%20filtered%20files%20tab.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('tampermonkey running');
    let versionselect = document.getElementById('dropdown-selected-item');
    /*let loaderFilters = Array.from(
        Array.from(document.querySelectorAll(".checkboxes-list"))
            .filter((e) => e.previousSibling.innerText == 'Mod Loaders')[0]
        .children[0]
        .children
    ).map((e)=> {
        return e.children[0].children[0]
    });
    console.log(loaderFilters);*/
    for (let objlink of document.querySelectorAll('.overlay-link')) {
        objlink.href = objlink.href+`/files/all?version=${versionselect.value}`;
    }
    const observer = new MutationObserver((records, observer) => {
        for (let record of records) {
            if (record.addedNodes && record.addedNodes[0]?.classList?.contains('results-container')) {
                for (let link of document.querySelectorAll('.overlay-link')) {
                    link.href = `${link.href}/files/all?version=${versionselect.value}`;
                }
            }
        }
    });
    console.log(`starting observer on ${document}`);
    observer.observe(document, {childList: true, subtree: true});
})();
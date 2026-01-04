// ==UserScript==
// @name         Auto Expand Subfolders List in Panopto
// @namespace    https://greasyfork.org/users/399468
// @version      1.0.1
// @license      MIT
// @description  Automatically expands the subfolder list in Panopto
// @author       ashdavis
// @match        https://*.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=panopto.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476631/Auto%20Expand%20Subfolders%20List%20in%20Panopto.user.js
// @updateURL https://update.greasyfork.org/scripts/476631/Auto%20Expand%20Subfolders%20List%20in%20Panopto.meta.js
// ==/UserScript==

window.onload = function() {
    let pageContent = document.querySelectorAll('#subfolderBar')[0];

    const expandFolders = function(mutationList,observer) {
        for(const mutation of mutationList) {
            if (mutation.type === 'childList') {
                const link = document.querySelector('.expand-subfolders.ellipsis.subfolder-wrapper > div');
                link.click();
                break;
            }
        }
    };

    const observer = new MutationObserver(expandFolders);
    if (pageContent){
        observer.observe(pageContent, { childList: true, subtree: true });
    }
}
// ==UserScript==
// @name           Collapse All Survey Folders in Qualtrics (New UI)
// @author         ashdavis
// @license        MIT
// @description    Collapses all folders on load (except the top level folder) and adds Collapse All button
// @match        https://*.qualtrics.com/Q/MyProjectsSection
// @version        1.0.9
// @namespace      https://greasyfork.org/users/399468
// @downloadURL https://update.greasyfork.org/scripts/392666/Collapse%20All%20Survey%20Folders%20in%20Qualtrics%20%28New%20UI%29.user.js
// @updateURL https://update.greasyfork.org/scripts/392666/Collapse%20All%20Survey%20Folders%20in%20Qualtrics%20%28New%20UI%29.meta.js
// ==/UserScript==
 
window.onload = function() {
    let pageContent = document.querySelectorAll('[class^="pageContent"]')[0];
 
    const collapseFolders = function(mutationList,observer) {
        for(const mutation of mutationList) {
           if (mutation.type === 'childList') {
                let collapsibleFolders = document.querySelectorAll('#all-folders [aria-label="Collapse"]:not([data-testid="0-toggle-sub-folder-button"])')
                if (collapsibleFolders.length != 0) {
                    collapsibleFolders.forEach(function(folder) {
                        folder.click();
                    });
 
                    let collapseButton = document.createElement('li');
 
                    collapseButton.innerHTML = 'Collapse All';
                    collapseButton.style.marginLeft = '50px';
                    collapseButton.classList.add('Folders-module_folder__2lups');
                    let folderContainer = document.getElementById('meta-folders');
                    folderContainer.insertAdjacentElement('afterbegin', collapseButton);
                    collapseButton.addEventListener('click', function() {
                        //querySelectorAll is a static list, so recalling in case a user added or deleted subfolders after page load instead of re-using collapsibleFolders
                        document.querySelectorAll('[aria-label="Collapse"]:not([data-testid="0-toggle-sub-folder-button"])').forEach(function(folder) {
                           folder.click();
                         });
                     });
                    observer.disconnect();
                    break;
                }
            }
        }
    };
 
    const observer = new MutationObserver(collapseFolders);
    observer.observe(pageContent, { childList: true, subtree: true });
}
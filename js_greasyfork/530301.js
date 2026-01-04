// ==UserScript==
// @name         Genius - Remove Complete the Song Sidebar
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Removes the “Complete the Song” sidebar.
// @author       Tu nombre
// @match        https://genius.com/*-lyrics
// @match        https://genius.com/*-annotated
// @grant        none
// @run-at       document-end
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/530301/Genius%20-%20Remove%20Complete%20the%20Song%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/530301/Genius%20-%20Remove%20Complete%20the%20Song%20Sidebar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeSidebar() {
        const sidebar = document.querySelector('aside.ContributorSidebar__Sidebar-sc-4d580236-0.ZVgcz');
        
        if(sidebar) {
            sidebar.remove();
            console.log('Sidebar removed');
        }
    }

    document.addEventListener('DOMContentLoaded', removeSidebar);
    
    setTimeout(removeSidebar, 2000);
})();
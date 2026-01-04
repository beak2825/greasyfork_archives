// ==UserScript==
// @name         MSD Title Updater
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Update Title for better history search
// @author       Shawn Q
// @match        https://servicedesk.microsoft.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377637/MSD%20Title%20Updater.user.js
// @updateURL https://update.greasyfork.org/scripts/377637/MSD%20Title%20Updater.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    WaitAndCheck();
    function WaitAndCheck(){
        setTimeout(function updateTitle() {
            if(document.getElementsByClassName("ng-binding")[1].innerText == '')
            {
                WaitAndCheck();
            }
            else{
                var caseId = document.getElementsByClassName("ng-binding")[1].innerText;
                var title = document.getElementsByClassName("ng-binding")[7].title;
                var oldTitle = document.title;
                document.title = oldTitle + ' - ' + title;
            };
        }, 800);
    }
})();
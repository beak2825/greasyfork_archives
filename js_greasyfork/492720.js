// ==UserScript==
// @name         Default to Compact View, since Sharepoint apparently doesn't let you set that as an option
// @namespace    http://tampermonkey.net/
// @version      2024-04-22
// @description  Gods Microsoft is annoying
// @author       You
// @match        https://dialogit.sharepoint.com/teams/DialogServicesNSW/rbb/Lists/Reusable%20Code%20Snippets/AllItems.aspx*
// @match        https://dialogit.sharepoint.com/teams/DialogServicesNSW/rbb/Lists/Reusable Code Snippets/AllItems.aspx*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sharepoint.com
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/492720/Default%20to%20Compact%20View%2C%20since%20Sharepoint%20apparently%20doesn%27t%20let%20you%20set%20that%20as%20an%20option.user.js
// @updateURL https://update.greasyfork.org/scripts/492720/Default%20to%20Compact%20View%2C%20since%20Sharepoint%20apparently%20doesn%27t%20let%20you%20set%20that%20as%20an%20option.meta.js
// ==/UserScript==

var todo1 = true;
var todo2 = true;

function changeListMode() {
    if(document.querySelector('[data-automationid="currentViewTab"]') != null && todo1) {
        todo1 = false;
        document.querySelector('[data-automationid="currentViewTab"]').childNodes[0].childNodes[1].click();
        setInterval(selectListMode,1000);
    }
}

function selectListMode() {
    if(document.querySelector('[data-automationid="SwitchLayoutCommand-COMPACTLIST"]') != null && todo2) {
        todo2 = false;
        document.querySelector('[data-automationid="SwitchLayoutCommand-COMPACTLIST"]').childNodes[0].click();
    }
}

(function() {
    'use strict';

    setInterval(changeListMode,1000);
})();
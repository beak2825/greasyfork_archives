// ==UserScript==
// @name         NU Auto Show Last Read
// @namespace    ultrabenosaurus.NovelUpdates
// @version      0.6
// @description  Automatically move to last read chapter when opening a series page, but not when manually browsing chapter list pages.
// @author       Ultrabenosaurus
// @license      GNU AGPLv3
// @source       https://greasyfork.org/en/users/437117-ultrabenosaurus?sort=name
// @match        https://www.novelupdates.com/series/*
// @icon         https://www.google.com/s2/favicons?domain=novelupdates.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395673/NU%20Auto%20Show%20Last%20Read.user.js
// @updateURL https://update.greasyfork.org/scripts/395673/NU%20Auto%20Show%20Last%20Read.meta.js
// ==/UserScript==

(function() {
    'use strict';


    if(document.querySelectorAll('span.nu_editnotes.removed').length==0 && document.querySelectorAll('table#myTable tbody tr.readcolor a.chp-release').length==0 && location.search==""){
        window.gotobk_rl();
        UBsetCookie('UBpaginationUpdated','true',1);
    }
})();

function UBsetCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
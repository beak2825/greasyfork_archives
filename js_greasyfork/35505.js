// ==UserScript==
// @name         WaniKani Hide Button in Review
// @version      0.1.4
// @description  Hide overly clunky buttons in Review and account for the size
// @author       polv
// @match        https://www.wanikani.com/review/session
// @grant        none
// @run-at		document-start
// @namespace https://greasyfork.org/users/160259
// @downloadURL https://update.greasyfork.org/scripts/35505/WaniKani%20Hide%20Button%20in%20Review.user.js
// @updateURL https://update.greasyfork.org/scripts/35505/WaniKani%20Hide%20Button%20in%20Review.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
       // Hook into App Store
    try { $('.app-store-menu-item').remove(); $('<li class="app-store-menu-item"><a href="https://community.wanikani.com/t/there-are-so-many-user-scripts-now-that-discovering-them-is-hard/20709">App Store</a></li>').insertBefore($('.navbar .dropdown-menu .nav-header:contains("Account")')); window.appStoreRegistry = window.appStoreRegistry || {}; window.appStoreRegistry[GM_info.script.uuid] = GM_info; localStorage.appStoreRegistry = JSON.stringify(appStoreRegistry); } catch (e) {}

    var button_to_hide = [1, 3];
    var button_name = [
        /*0*/ "option-wrap-up",
        /*1*/ "option-last-items",
        /*2*/ "option-item-info",
        /*3*/ "option-kana-chart",
        /*4*/ "option-audio",
        /*5*/ "option-double-check",
        /*6*/ "option-retype",
        /*7*/ //"option-mark0",
        /*8*/ //"option-mark1",
        /*9*/ //"option-mark2",
        /*10*/ //"option-mark3",
        /*11*/ //"option-mark4"
        ];
    
    for(var i=0; i<button_to_hide.length; i++) {
        document.getElementById(button_name[button_to_hide[i]]).style.display = "none";
    }
    
    for(i=0; i<button_name.length; i++) {
        document.getElementById(button_name[i]).style.width = 99/(button_name.length - button_to_hide.length) + "%";
    }
})();
// visit some profile on fb, then open console then type and press enter: get_id
// ==UserScript==
// @name         Get Facebook UID
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Extract FB UID in Profile URL
// @author       Loc Vo
// @match        https://www.facebook.com/*
// @require      http://code.jquery.com/jquery-latest.js
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/389821/Get%20Facebook%20UID.user.js
// @updateURL https://update.greasyfork.org/scripts/389821/Get%20Facebook%20UID.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let uid = JSON.parse(document.getElementById("pagelet_timeline_main_column").getAttribute("data-gt")).profile_owner;
    if(uid != null && uid != '') {
        console.log(uid);
        unsafeWindow.fbid=uid;
    }
})();
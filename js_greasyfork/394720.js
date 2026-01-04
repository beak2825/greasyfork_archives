// ==UserScript==
// @name         InnoReader lock buy window
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Lock buy window
// @author       You
// @match        https://www.inoreader.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394720/InnoReader%20lock%20buy%20window.user.js
// @updateURL https://update.greasyfork.org/scripts/394720/InnoReader%20lock%20buy%20window.meta.js
// ==/UserScript==

(function() {
    var innoDialogCreate = window.inno_dialog_create;

    window.inno_dialog_create = function(dialog_type, dialog_prefs, params) {
        if(window.adb_id === dialog_type) {
            console.log('Inno ADB message locked');
            window.createCookie('aguineapigtrickedme',1,1);
            return;
        }

        innoDialogCreate(dialog_type, dialog_prefs, params);
    };
})();
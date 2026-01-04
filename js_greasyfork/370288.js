// ==UserScript==
// @name         25pp_download_direct
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Download cracked ipa directly, without bullshit.
// @author       skytoup
// @match        https://www.25pp.com/ios/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370288/25pp_download_direct.user.js
// @updateURL https://update.greasyfork.org/scripts/370288/25pp_download_direct.meta.js
// ==/UserScript==
(function() {
    'use strict';

    function dl() {
        var button=document.getElementsByClassName("btn-install-x")[0];
        button.onclick=null;
        button.href = atob(button.getAttribute("appdownurl"));
    }

    var _show = MaskDialog.show;
    MaskDialog.show = function(a, b) {
        _show(a, b);
        dl();
    }

    dl();
})();
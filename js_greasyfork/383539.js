// ==UserScript==
// @name         Uncrappify UPC/Liberty Global Wireless Gateway config
// @namespace    keschercode
// @version      1
// @description  Fix Wireless Gateway's crappy config website for UPC, UnityMedia, and others
// @author       Jeremy Kescher <jeremy@kescher.at>
// @include      http://192.168.0.1/common_page/login.html
// @downloadURL https://update.greasyfork.org/scripts/383539/Uncrappify%20UPCLiberty%20Global%20Wireless%20Gateway%20config.user.js
// @updateURL https://update.greasyfork.org/scripts/383539/Uncrappify%20UPCLiberty%20Global%20Wireless%20Gateway%20config.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // login field: Password would be shown in clear text. Bad practice.
    var pwField = document.getElementById('loginPassword');

    if (pwField.getAttribute('type') == 'text') {
        pwField.setAttribute('type', 'password');
    }
    
})();
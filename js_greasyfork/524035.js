// ==UserScript==
// @name         Clear Recent Logins on Facebook
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove user profile icon login button on logout/login screen
// @author       figuccio
// @match        https://www.facebook.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @icon         https://facebook.com/favicon.ico
// @noframes
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524035/Clear%20Recent%20Logins%20on%20Facebook.user.js
// @updateURL https://update.greasyfork.org/scripts/524035/Clear%20Recent%20Logins%20on%20Facebook.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clearRecentLogins() {
        if (document.getElementById('email')) {
            document.getElementById('email').value = "";
            document.getElementById('email').focus();
        }
        if (!document.querySelectorAll('.removableItem a[role="button"][ajaxify^="/login/device-based"]').length) return;
        var x = document.querySelectorAll('.removableItem a[role="button"][ajaxify^="/login/device-based"]');
        for (var i = 0; i < x.length; i++) x[i].click();
    }

    function togglermrecentlogins() {
        GM_setValue('rmrecentlogins', document.getElementById('rmrecentlogins').checked ? '1' : '0');
        if (document.getElementById('rmrecentlogins').checked) clearRecentLogins();
    }

    function rmrecentlogins() {
        if (!document.getElementById('rmrecentlogins')) {
            var rmrecentloginsbar = document.createElement('div');
            rmrecentloginsbar.innerHTML = "<div id='rmrecentloginsdiv' align='center'><span id='recentloginsspan'><input type='checkbox' id='rmrecentlogins' style='vertical-align: -2px;'> <label for='rmrecentlogins' style='font-size:14px !important;color:green;font-weight:600'>Auto Remove Recent Logins with FBP</label></span></div>";
            document.querySelector('#content').firstChild.parentNode.insertBefore(rmrecentloginsbar, document.querySelector('#content').firstChild);
            document.getElementById('recentloginsspan').addEventListener('click', togglermrecentlogins, false);
        }

        var rmrecentloginsvalue = GM_getValue('rmrecentlogins');
        if (rmrecentloginsvalue === '1') {
            document.getElementById('rmrecentlogins').checked = true;
            clearRecentLogins();
        }
    }

    rmrecentlogins();
})();

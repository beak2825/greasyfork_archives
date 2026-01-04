// ==UserScript==
// @name         TSR free vip
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  This script makes you vip tsr this site
// @author        ooga booga
// @match        https://www.thesimsresource.com/*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=thesimsresource.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446656/TSR%20free%20vip.user.js
// @updateURL https://update.greasyfork.org/scripts/446656/TSR%20free%20vip.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.isAdBlocked = false;
    window.isVIP = function () {
        return true;
    }
    window.isVipSubscriber = function () {
        return true
    }
    window._installBasket = function () {
        var mid = typeof (localStorage.memberId) !== 'undefined' ? localStorage.memberId : 0;
        var lk = typeof (localStorage.LoginKey) !== 'undefined' ? localStorage.LoginKey : 0;
        var url = '/ajax.php?c=downloads&a=installBasket' + '&mid=' + mid + '&lk=' + lk;
        window.$.ajax(url).done(function (data) {
            if (data.error && data.error.length > 0) {
                console.log('logout initiated during install');
                alert(data.error);
                if (data.logout)
                    window.logout();
            } else {
                window.protocolCheck(data.url, function () {
                    var ccpageShown = Number($.cookie('ccpage-shown'));
                    if (isNaN(ccpageShown))
                        ccpageShown = 0;
                    if (ccpageShown >= 3)
                        return;
                    window.$.cookie('ccpage-shown', ccpageShown + 1, {
                        path: '/',
                        domain: '.thesimsresource.com',
                        expires: 7
                    });
                    window.open('/ccmanager', 'ccmanager');
                });
            }
        }).fail(function (err) {
            console.log('Error in ccInstall', err);
            alert(err.message);
        });
    }
})();
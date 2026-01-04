// ==UserScript==
// @name        Google Meet Default User
// @include     *meet.google.com*
// @exclude     none
// @auther      kjung
// @version     0.0.1
// @description  Sets default authuser for google meet URLs.
// @grant           none
// @description Automatically admits Google Meet participants
// @namespace https://greasyfork.org/users/6863
// @downloadURL https://update.greasyfork.org/scripts/420784/Google%20Meet%20Default%20User.user.js
// @updateURL https://update.greasyfork.org/scripts/420784/Google%20Meet%20Default%20User.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var authuser = "1"

    function redirect() {
        var meetingUrl = window.location.href
        if (meetingUrl.includes('authuser=' + authuser)) {
            return
        }

        var redirecUrl = window.location.href.split('?')[0] + '?authuser=' + authuser;
        window.location.replace(redirecUrl);
    }

    redirect()
})();
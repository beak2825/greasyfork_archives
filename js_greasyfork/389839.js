// ==UserScript==
// @name           Yandex.Mail reklam engelleyici.
// @description    Yandex.Mail reklamlarını siler.
// @author         alpsavrum
// @version        1.0
// @license        MIT
// @match          *://mail.yandex.com.tr/*
// @grant          <> <! [CDATA []]> </>
// @require        https://code.jquery.com/jquery-3.2.1.min.js
// @namespace https://greasyfork.org/users/366988
// @downloadURL https://update.greasyfork.org/scripts/389839/YandexMail%20reklam%20engelleyici.user.js
// @updateURL https://update.greasyfork.org/scripts/389839/YandexMail%20reklam%20engelleyici.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function remove() {
        $('.ns-view-infoline-box + div').hide();
        $('.b-toolbar + .b-direct-stripe').hide();
        $('.ns-view-collectors-setup + div').hide();
    }
    document.addEventListener("DOMContentLoaded", remove);
    document.addEventListener("DOMSubtreeModified", remove);
})();